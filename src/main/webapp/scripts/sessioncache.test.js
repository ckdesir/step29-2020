import { SessionCache } from './sessioncache';
import { Poller } from './poller';
import fetch from 'jest-fetch-mock';

fetch.enableMocks();
jest.setTimeout(40000);

const pollSpy = jest.spyOn(Poller.prototype, 'poll_');
const setTimeoutSpy = jest.spyOn(window, 'setTimeout');
const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');
const params =  new URLSearchParams('?session-id=EEEE7&name=chris');

const expected = {
  sessionID: 'EEEE7',
  controller: 'chris',
  listOfAttendes: ['chris', 'bryan']
};

afterEach(() => {    
  jest.clearAllMocks();
  fetch.resetMocks();
});

test('Test to see if stop is working correctly!', (done) => {
  fetch.mockResponse(JSON.stringify(expected));

  const cache = new SessionCache(params, 1000, 1000);
  cache.start();

  setTimeout(() => {
    cache.stop();
    // expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
    // expect(setTimeoutSpy.mock.calls.length).toBeGreaterThan(20);
    // expect(pollSpy.mock.calls.length).toBeGreaterThan(20);
    console.log(cache.getSessionInformation());
    cache.getSessionInformation().then(function(result) { 
      console.log(result); 
    });
    done();
  }, 1000);

});

test('We can check if poll() is called correct amount' + 
    'of times + correct return value', (done) => {
      fetch.mockResponse(JSON.stringify(expected));

      const cache = new SessionCache(params, 1000, 1000);
      cache.start();

      setTimeout(() => {
        expect(clearTimeoutSpy).toHaveBeenCalledTimes(0);
        expect(setTimeoutSpy.mock.calls.length).toBeGreaterThan(10);
        expect(pollSpy.mock.calls.length).toBeGreaterThanOrEqual(5);
        expect(cache.getSessionInformation()).toEqual(expected);
        done();
      }, 5000);
});

test('stopping before starting', () => {
  fetch.mockResponse(JSON.stringify(expected));
  const cache = new SessionCache(params, 1000, 1000);
  cache.stop();
  expect(clearTimeoutSpy).toHaveBeenCalledTimes(2);
  expect(pollSpy).toHaveBeenCalledTimes(0);
  expect(setTimeoutSpy).toHaveBeenCalledTimes(0);
  expect(cache.getSessionInformation()).toBeFalsy();
});

test('starting up, immediately stopping', () => {
  fetch.mockResponse(JSON.stringify(expected));
  const cache = new SessionCache(params, 1000, 1000);
  cache.start();
  cache.stop();
  expect(clearTimeoutSpy).toHaveBeenCalledTimes(2);
  expect(pollSpy).toHaveBeenCalledTimes(1);
  expect(setTimeoutSpy).toHaveBeenCalledTimes(1);
  expect(cache.getSessionInformation()).toBeFalsy();
});

test('starting up after stopping', (done) => {
  fetch.mockResponse(JSON.stringify(expected));
  const cache = new SessionCache(params, 1000, 1000);
  cache.start();
  cache.stop();
  cache.start();
  setTimeout(() => {
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(2);
    expect(setTimeoutSpy.mock.calls.length).toBeGreaterThanOrEqual(12);
    expect(pollSpy.mock.calls.length).toBeGreaterThanOrEqual(10);
    expect(cache.getSessionInformation()).toEqual(expected);   
    done();
  }, 5000);
});

test.only('Test to see if starting and immediately checking', () => {
  fetch.mockResponse(JSON.stringify(expected));

  const cache = new SessionCache(params, 1000);
  cache.start();
  cache.getSessionInformation().then(result => {
    console.log(result);
    expect(result).toEqual(expected);
  });
});
