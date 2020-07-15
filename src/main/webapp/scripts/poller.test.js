import { Poller } from './poller';

jest.useFakeTimers();

test('We can check if poll() is called correct amount of times + correct return value', () => {
  const poll = new Poller(pollingFunction, 1000);
  const pollSpy = jest.spyOn(poll, 'poll_');
  const setTimeoutSpy = jest.spyOn(window, 'setTimeout');
  const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');

  poll.testOnlySetMaxPollAttempts(3);
  poll.start();

  jest.runAllTimers();

  expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
  expect(setTimeoutSpy).toHaveBeenCalledTimes(3);
  expect(pollSpy).toHaveBeenCalledTimes(4);
  expect(poll.getLastResult()).toBe(true);

  pollSpy.mockRestore();
  setTimeoutSpy.mockRestore();
  clearTimeoutSpy.mockRestore();
});

test.only('Test to see if stop is working correctly!', () => {
  const poll = new Poller(pollingFunction, 1000);
  const pollSpy = jest.spyOn(poll, 'poll_');
  const setTimeoutSpy = jest.spyOn(window, 'setTimeout');
  const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');

  poll.start();
  poll.stop();

  jest.runAllTimers();

  expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
  expect(setTimeoutSpy).toHaveBeenCalledTimes(10);
  expect(pollSpy).toHaveBeenCalledTimes(11);
  expect(poll.getLastResult()).toBe(true);
});

test('stopping before starting') {

}

test('starting up again after stopping') {
  
}

function pollingFunction() {
  return true;
}
