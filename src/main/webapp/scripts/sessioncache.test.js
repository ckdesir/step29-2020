import { SessionCache } from './sessioncache';
import { Poller } from './poller';

//import "isomorphic-fetch";
//import fetchMock from 'jest-fetch-mock';
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
  listOfAttendes: ['chris']
};

// global.fetch = jest.fn(() =>
//   Promise.resolve({
//     json: () => Promise.resolve(expected),
//   })
// );

// jest.spyOn(window, "fetch").mockImplementation(() => {
//   const fetchResponse = {
//     json: () => Promise.resolve(expected)
//   };
//   return Promise.resolve(fetchResponse);
// });

afterEach(() => {    
  jest.clearAllMocks();
  fetch.resetMocks();
});

// beforeEach(() => {
//   fetchMock.mock('https://randomuser.me/api/?results=10', req => {
//     return expected;
//   })
// });

test.only('Test to see if stop is working correctly!', (done) => {
  fetch.mockResponse(JSON.stringify(expected));

  const cache = new SessionCache(params, 1000, 1000);
  cache.start();

  setTimeout(() => {
    cache.stop();
    // expect(clearTimeoutSpy).toHaveBeenCalledTimes(2);
    // expect(setTimeoutSpy.mock.calls.length).toBeGreaterThan(40);
    // expect(pollSpy.mock.calls.length).toBeGreaterThan(20);
    cache.getSessionInformation().then((val) => console.log(val));
    //console.log(cache.getSessionInformation().then());  
    done();
  }, 2000);
});

test('We can check if poll() is called correct amount' + 
    'of times + correct return value', (done) => {
      const poll = new Poller(pollingFunction, 1000);
      poll.start();
      setTimeout(() => {
        expect(clearTimeoutSpy).toHaveBeenCalledTimes(0);
        expect(setTimeoutSpy).toHaveBeenCalledTimes(6);
        expect(pollSpy).toHaveBeenCalledTimes(5);
        expect(poll.getLastResult()).toBe(true);    
        done();
      }, 5000);
});

test('stopping before starting', () => {
  const poll = new Poller(pollingFunction, 1000);
  poll.stop();
  expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
  expect(pollSpy).toHaveBeenCalledTimes(0);
  expect(setTimeoutSpy).toHaveBeenCalledTimes(0);
  expect(poll.getLastResult()).toBeFalsy();
});

test('starting up, immediately stopping', () => {
  const poll = new Poller(pollingFunction, 1000);
  poll.start();
  poll.stop();
  expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
  expect(pollSpy).toHaveBeenCalledTimes(1);
  expect(setTimeoutSpy).toHaveBeenCalledTimes(1);
  expect(poll.getLastResult()).toBeTruthy();
});

test('starting up after stopping', (done) => {
  const poll = new Poller(pollingFunction, 1000);
  poll.start();
  poll.stop();
  poll.start();
  setTimeout(() => {
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
    expect(setTimeoutSpy.mock.calls.length).toBeGreaterThanOrEqual(6);
    expect(pollSpy.mock.calls.length).toBeGreaterThanOrEqual(5);
    expect(poll.getLastResult()).toBe(true);    
    done();
  }, 5000);
});

function pollingFunction() {
  return true;
}