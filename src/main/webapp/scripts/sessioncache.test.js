import { SessionCache } from './sessioncache';
import fetch from 'jest-fetch-mock';

fetch.enableMocks();
jest.setTimeout(40000);

const setTimeoutSpy = jest.spyOn(window, 'setTimeout');
const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');
const testParams =  new URLSearchParams('?session-id=EEEE7&name=chris');

const expectedResult = {
  sessionID: 'EEEE7',
  controller: 'chris',
  listOfAttendes: ['chris', 'bryan']
};

afterEach(() => {    
  jest.clearAllMocks();
  fetch.resetMocks();
});

test('Test to see if stop is working correctly!', (done) => {
  fetch.mockResponse(JSON.stringify(expectedResult));

  const cache = new SessionCache(testParams, 1000);
  cache.start();

  setTimeout(() => {
    cache.stop();
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(2);
    expect(setTimeoutSpy.mock.calls.length).toBeGreaterThan(40);
    expect(cache.getSessionInformation()).toEqual(expectedResult);
    done();
  }, 30000);
});

test('Checks continuation of refreshing - no stop', (done) => {
      fetch.mockResponse(JSON.stringify(expectedResult));

      const cache = new SessionCache(testParams, 1000);
      cache.start();

      setTimeout(() => {
        expect(clearTimeoutSpy).toHaveBeenCalledTimes(0);
        expect(setTimeoutSpy.mock.calls.length).toBeGreaterThan(10);
        expect(cache.getSessionInformation()).toEqual(expectedResult);
        done();
      }, 5000);
});

test('stopping before starting', () => {
  fetch.mockResponse(JSON.stringify(expectedResult));
  const cache = new SessionCache(testParams, 1000);
  cache.stop();
  expect(clearTimeoutSpy).toHaveBeenCalledTimes(2);
  expect(setTimeoutSpy).toHaveBeenCalledTimes(0);
  expect(cache.getSessionInformation()).toBeFalsy();
});

test('starting up, immediately stopping', () => {
  fetch.mockResponse(JSON.stringify(expectedResult));
  const cache = new SessionCache(testParams, 1000);
  cache.start();
  cache.stop();
  expect(clearTimeoutSpy).toHaveBeenCalledTimes(2);
  expect(setTimeoutSpy).toHaveBeenCalledTimes(1);
  expect(cache.getSessionInformation()).toBeFalsy();
});

test('starting up after stopping', (done) => {
  fetch.mockResponse(JSON.stringify(expectedResult));
  const cache = new SessionCache(testParams, 1000);
  cache.start();
  cache.stop();
  cache.start();
  setTimeout(() => {
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(2);
    expect(setTimeoutSpy.mock.calls.length).toBeGreaterThanOrEqual(12);
    expect(cache.getSessionInformation()).toEqual(expectedResult);   
    done();
  }, 5000);
});
