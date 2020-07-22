import * as sessionscript from './session-script';
import { Session } from './session';
import { ServerClient } from './serverclient';

afterEach(() => {    
  jest.clearAllMocks();
});

test('display none to block', () => {
  document.body.innerHTML = '<div id="container"></div>';
  const container = document.getElementById('container');
  const div = document.createElement('div');
  div.style.display = 'none';
  div.id = 'session-info-div';
  container.appendChild(div);
  sessionscript.openSessionInfo();
  expect(div.style.display).toEqual('block');
});

test('display block to none', () => {
  document.body.innerHTML = '<div id="container"></div>';
  const container = document.getElementById('container');
  const div = document.createElement('div');
  div.style.display = 'block';
  div.id = 'session-info-div';
  container.appendChild(div);
  sessionscript.closeDisplay(div);
  expect(container.style.display).toEqual('none');
});

test('change display using both functions - open then close', () => {
  document.body.innerHTML = '<div id="container"></div>';
  const container = document.getElementById('container');
  const div = document.createElement('div');
  div.style.display = 'none';
  div.id = 'session-info-div';
  container.appendChild(div);
  sessionscript.openSessionInfo();
  sessionscript.closeDisplay(div);
  expect(div.style.display).toEqual('block');
  expect(container.style.display).toEqual('none');
});

test('already opened', () => {
  document.body.innerHTML = '<div id="container"></div>';
  const container = document.getElementById('container');
  const div = document.createElement('div');
  div.style.display = 'block';
  div.id = 'session-info-div';
  container.appendChild(div);
  sessionscript.openSessionInfo();
  expect(div.style.display).toEqual('block');
});

test('tests copy and paste', () => {
  document.body.innerHTML = '<div id="container"></div>';
  const container = document.getElementById('container');
  const input = document.createElement('input');
  input.id = 'session-id-field';
  input.name = 'session-id';
  input.value = 'hello!';
  input.addEventListener('click', () => {
    sessionscript.copyTextToClipboard(input)
  });
  container.appendChild(input);
  document.execCommand = jest.fn();
  input.click();
  expect(document.execCommand).toHaveBeenCalledWith('copy');
});

test('Tests to see if controller updates correctly UI wise', () => {
  document.body.innerHTML = '';
  const sessionInfoAttendeeDiv =
      document.createElement('div');
  sessionInfoAttendeeDiv.id = 'session-info-attendees';
  document.body.appendChild(sessionInfoAttendeeDiv);
  sessionscript.buildAttendeeDiv('Jessica');
  sessionscript.buildAttendeeDiv('Bryan');
  sessionscript.buildAttendeeDiv('Chris');
  const urlParamSpy = 
      jest.spyOn(window.URLSearchParams.prototype, 'get').
          mockReturnValue('Jessica');
  const sessionSpy = 
      jest.spyOn(Session.prototype, 'getScreenNameOfController').
          mockReturnValue('Jessica');
  sessionscript.updateController();
  expect(sessionInfoAttendeeDiv.querySelector(`#${'Jessica'}`)
      .parentElement.querySelector('span').style.
          backgroundColor).toEqual('rgb(253, 93, 0)');
  expect(sessionInfoAttendeeDiv.querySelector(`#${'Bryan'}`)
      .parentElement.querySelector('span').style.
          backgroundColor).toEqual('rgb(255, 255, 255)');
  expect(sessionInfoAttendeeDiv.querySelector(`#${'Chris'}`)
      .parentElement.querySelector('span').style.
          backgroundColor).toEqual('rgb(255, 255, 255)');
});

test('tests changeToReadOnly()', () => {
  document.body.innerHTML = '';
  const sessionSpy = 
      jest.spyOn(Session.prototype, 'getSessionId').
          mockReturnValue('1eee3414123');
  const sessionInfoInput = document.createElement('input');
  sessionInfoInput.id = 'session-info-input';
  const welcomeMessageInput = document.createElement('input');
  welcomeMessageInput.id = 'welcome-message-input';
  sessionscript.changeToReadOnly();
  expect(sessionInfoInput.readOnly).toBe(true);
  expect(welcomeMessageInput.readOnly).toBe(true);
  expect(sessionInfoInput.value).toEqual('1eee3414123');
  expect(welcomeMessageInput.value).toEqual('1eee3414123');
});

test('tests passController() - controller clicks', () => {
  const urlParamSpy = 
      jest.spyOn(window.URLSearchParams.prototype, 'get').
          mockReturnValue('Jessica');
  const sessionSpy = 
      jest.spyOn(Session.prototype, 'getScreenNameOfController').
          mockReturnValue('Jessica');
  const passControllerSpy = 
      jest.spyOn(ServerClient.prototype, 'passController');
  const attendeeDiv = document.createElement('div');
  attendeeDiv.className = 'attendee-div'
  const controllerToggle = 
      document.createElement('span');
  controllerToggle.className = 'controller-toggle';
  controllerToggle.addEventListener('click', 
      sessionscript.passController, false);
  const attendeeName =
      document.createElement('h3');
  attendeeName.innerHTML = 'Naomi';
  attendeeName.className = 'attendee-name'
  attendeeName.id = 'Naomi';
  attendeeDiv.appendChild(controllerToggle);
  attendeeDiv.appendChild(attendeeName);
  controllerToggle.click();
  expect(passControllerSpy).toBeCalledWith('Naomi');
});

test('tests passController() - controller does not click', () => {
  const urlParamSpy = 
      jest.spyOn(window.URLSearchParams.prototype, 'get').
          mockReturnValue('Jessica');
  const sessionSpy = 
      jest.spyOn(Session.prototype, 'getScreenNameOfController').
          mockReturnValue('Naomi');
  const passControllerSpy = 
      jest.spyOn(ServerClient.prototype, 'passController');
  const attendeeDiv = document.createElement('div');
  attendeeDiv.className = 'attendee-div'
  const controllerToggle = 
      document.createElement('span');
  controllerToggle.className = 'controller-toggle';
  controllerToggle.addEventListener('click', 
      sessionscript.passController, false);
  const attendeeName =
      document.createElement('h3');
  attendeeName.innerHTML = 'Bob';
  attendeeName.className = 'attendee-name'
  attendeeName.id = 'Bob';
  attendeeDiv.appendChild(controllerToggle);
  attendeeDiv.appendChild(attendeeName);
  controllerToggle.click();
  expect(passControllerSpy).toBeCalledTimes(0);
});

test(`We can check if correct errors are thrown -
    ${'connectedFromServer'}`, () => {
      try {
        sessionscript.connectedToServer();
      } catch (e) {
        expect(e.message).toBe('Unimplemented');
      }
});

test(`We can check if correct errors are thrown -
    ${'disconnectedFromServer'}`, () => {
      try {
        sessionscript.disconnectedFromServer();
      } catch (e) {
        expect(e.message).toBe('Unimplemented');
      }
});
