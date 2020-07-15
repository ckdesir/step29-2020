import { Poller } from './poller';

jest.setTimeout(15000);

const setTimeoutSpy = jest.spyOn(window, 'setTimeout');
const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');
const pollSpy = jest.spyOn(Poller.prototype, 'poll_');

afterEach(() => {    
  jest.clearAllMocks();
});

test('Test to see if stop is working correctly!', (done) => {
  const poll = new Poller(pollingFunction, 1000);
  poll.start();
  setTimeout(() => {
    poll.stop();
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
    expect(setTimeoutSpy).toHaveBeenCalledTimes(11);
    expect(pollSpy).toHaveBeenCalledTimes(10);
    expect(poll.getLastResult()).toBe(true);    
    done();
  }, 10000);
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
