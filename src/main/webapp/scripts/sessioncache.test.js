import { SessionCache } from './sessioncache';
import { Session } from './session.js';
import fetch from 'jest-fetch-mock';

fetch.enableMocks();
jest.setTimeout(40000);

const expectedResult = {
  sessionId: 'EEEE7',
  ipOfVM: '1.2.3.4.5.6.7',
  screenNameOfController: 'chris',
  listOfAttendes: ['chris', 'bryan']
};

afterEach(() => {    
  jest.clearAllMocks();
  fetch.resetMocks();
});

test('Test to see if stop is working correctly!', (done) => {
  fetch.mockResponse(JSON.stringify(expectedResult));
  const cache = new SessionCache(testSessionRequest, 1000);
  cache.start();
  setTimeout(async () => {
    cache.stop();
    await expect(cache.getSession()).
        resolves.toEqual(Session.fromObject(expectedResult));
    done();
  }, 30000);
});

test('Checks continuation of refreshing - no stop', (done) => {
  fetch.mockResponse(JSON.stringify(expectedResult));
  const cache = new SessionCache(testSessionRequest, 1000);
  cache.start();
  setTimeout(async () => {
    await expect(cache.getSession()).
        resolves.toEqual(Session.fromObject(expectedResult));
    done();
  }, 5000);
});

test('stopping before starting', async () => {
  fetch.mockResponse(JSON.stringify(expectedResult));
  const cache = new SessionCache(testSessionRequest, 1000);
  cache.stop();
  await expect(cache.getSession()).
      rejects.toThrowError('No contact with server.');
});

test('starting up, immediately stopping', async () => {
  fetch.mockResponse(JSON.stringify(expectedResult));
  const cache = new SessionCache(testSessionRequest, 1000);
  cache.start();
  cache.stop();
  await expect(cache.getSession()).
      resolves.toEqual(Session.fromObject(expectedResult));
});

test('starting up after stopping', (done) => {
  fetch.mockResponse(JSON.stringify(expectedResult));
  const cache = new SessionCache(testSessionRequest, 1000);
  cache.start();
  cache.stop();
  cache.start();
  setTimeout(async () => {
    await expect(cache.getSession()).
        resolves.toEqual(Session.fromObject(expectedResult)); 
    done();
  }, 5000);
});

test('retrieving info after starting immediately', async () => {
  fetch.mockResponse(JSON.stringify(expectedResult));
  const cache = new SessionCache(testSessionRequest, 1000);
  cache.start();
  await expect(cache.getSession()).
      resolves.toEqual(Session.fromObject(expectedResult));
});

async function testSessionRequest() {
  const response =
      await fetch('https://api.exchangeratesapi.io/latest?base=USD');
  return await response.json();
}