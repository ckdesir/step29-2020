import { ServerClient } from './serverclient';
import fetch from 'jest-fetch-mock';
import { Session } from './session.js';

fetch.enableMocks();

const testParams =  new URLSearchParams('?session-id=EEEE7&name=chris');
const expectedResult = {
  sessionId: 'EEEE7',
  ipOfVM: '1.2.3.4.5.6.7',
  screenNameOfController: 'chris',
  listOfAttendees: ['chris', 'bryan']
};

afterEach(() => {    
  jest.clearAllMocks();
  fetch.resetMocks();
});

test('Checks to make sure the correct URL is called - changeController', () => {
  const urlParamSpy = 
      jest.spyOn(window.URLSearchParams.prototype, 'get').
          mockReturnValue('EEEE7');
  const client = new ServerClient(testParams);
  client.changeControllerTo('Jessica');
  expect(fetch.mock.calls[1][0].url).toEqual('/change-controller');
});

test('Simulates a failed response on change-controller-to', () => {
  fetch.mockReject(new Error('No contact with server,' + 
  'unsuccessful in changing controller!'));
  const urlParamSpy = 
      jest.spyOn(window.URLSearchParams.prototype, 'get').
          mockReturnValue('EEEE7');
  const client = new ServerClient(testParams);
  try {
    client.changeControllerTo('Jessica');
  } catch (e) {
    expect(e.message).toBe('No contact with server,' + 
        'unsuccessful in changing controller!');
  }
});

test('Simulates an aborted response on change-controller-to', () => {
  fetch.mockAbort();
  const urlParamSpy = 
      jest.spyOn(window.URLSearchParams.prototype, 'get').
          mockReturnValue('EEEE7');
  const client = new ServerClient(testParams);
  try {
    client.changeControllerTo('Jessica');
  } catch (e) {
    expect(e.message).toBe('No contact with server,' + 
        'unsuccessful in changing controller!');
  }
});

test('Tests get session, makes sure the correct Session object returns', async () => {
  fetch.mockResponse(JSON.stringify(expectedResult));
  const client = new ServerClient(testParams);
  await expect(client.getSession()).
      resolves.toEqual(Session.fromObject(expectedResult)); 
});
