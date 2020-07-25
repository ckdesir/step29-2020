import * as sessionscript from './session-script';
import { Session } from './Session';
import { ServerClient } from './serverclient';
import fetch from 'jest-fetch-mock';

const buildAttendeeDivSpy =
    jest.spyOn(sessionscript.sessionScriptSpies, 'buildAttendeeDiv');
const notifyOfChangesToMembershipSpy =
    jest.spyOn(sessionscript.sessionScriptSpies,
        'notifyOfChangesToMembership');

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

test('adding an attendee div', () => {
  document.body.innerHTML = '';
  const sessionInfoAttendeeDiv =
      document.createElement('div');
  sessionInfoAttendeeDiv.id = 'session-info-attendees';
  document.body.appendChild(sessionInfoAttendeeDiv);
  const attendeeDivExpected = document.createElement('div');
  attendeeDivExpected.className = 'attendee-div'
  const controllerToggle = 
      document.createElement('span');
  controllerToggle.className = 'controller-toggle';
  controllerToggle.addEventListener('click', event => {
    sessionscript.changeController(event, 'Bryan');
  }, false);  
  const attendeeName = document.createElement('h3');
  attendeeName.innerHTML = 'hello';
  attendeeName.className = 'attendee-name'
  attendeeName.id = 'hello';
  attendeeDivExpected.appendChild(controllerToggle);
  attendeeDivExpected.appendChild(attendeeName);
  sessionscript.buildAttendeeDiv('hello', 'Bryan');
  expect(sessionInfoAttendeeDiv.childNodes[0]).
      toEqual(attendeeDivExpected);
});

test('Tests to see if controller updates correctly UI wise', () => {
  document.body.innerHTML = '';
  const sessionInfoAttendeeDiv =
      document.createElement('div');
  sessionInfoAttendeeDiv.id = 'session-info-attendees';
  document.body.appendChild(sessionInfoAttendeeDiv);
  sessionscript.buildAttendeeDiv('Jessica', 'Jessica');
  sessionscript.buildAttendeeDiv('Bryan', 'Jessica');
  sessionscript.buildAttendeeDiv('Chris', 'Jessica');
  const urlParamSpy = 
      jest.spyOn(window.URLSearchParams.prototype, 'get').
          mockReturnValue('Jessica');
  const sessionSpy = 
      jest.spyOn(Session.prototype, 'getScreenNameOfController').
          mockReturnValue('Jessica');
  sessionscript.updateController('Jessica');
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
  const clientSpy = 
      jest.spyOn(ServerClient.prototype, 'getSession').
          mockResolvedValue(new Session(
              'leee3414123', '1234', [], 'Bryan'));
  const sessionSpy = 
      jest.spyOn(Session.prototype, 'getSessionId').
          mockReturnValue('leee3414123');
  const sessionInfoInput = document.createElement('input');
  sessionInfoInput.id = 'session-info-input';
  const welcomeMessageInput = document.createElement('input');
  welcomeMessageInput.id = 'welcome-message-input';
  document.body.appendChild(sessionInfoInput);
  document.body.appendChild(welcomeMessageInput);
  sessionscript.changeToReadOnly('leee3414123');
  expect(sessionInfoInput.readOnly).toBe(true);
  expect(welcomeMessageInput.readOnly).toBe(true);
  expect(sessionInfoInput.value).toEqual('leee3414123');
  expect(welcomeMessageInput.value).toEqual('leee3414123');
});

test('tests passController() - controller clicks', () => {
  const urlParamSpy = 
      jest.spyOn(window.URLSearchParams.prototype, 'get').
          mockReturnValue('Jessica');
  const passControllerSpy = 
      jest.spyOn(ServerClient.prototype, 'passController');
  const attendeeDiv = document.createElement('div');
  attendeeDiv.className = 'attendee-div'
  const controllerToggle = 
      document.createElement('span');
  controllerToggle.className = 'controller-toggle';
  controllerToggle.addEventListener('click', event => {
    sessionscript.passController(event, 'Jessica');
  }, false);
  const attendeeName = document.createElement('h3');
  attendeeName.innerHTML = 'Naomi';
  attendeeName.className = 'attendee-name';
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

test(`makes sure notifyOfChangesToMembership is
correctly displaying message`, (done) => {
    const displayMessage = 'How are you ';
    document.body.innerHTML = '';
    const alertMembershipDiv =
        document.createElement('div');
    alertMembershipDiv.id = 'alert-membership';
    document.body.appendChild(alertMembershipDiv);
    sessionscript.notifyOfChangesToMembership(displayMessage);
    setTimeout(() => {
      expect(alertMembershipDiv.textContent).toEqual('How are you.');
      expect(alertMembershipDiv.className).toEqual('display-message');
      done();
    }, 2000);
    setTimeout(() => {
      expect(alertMembershipDiv.className).toEqual('');
      done();
    }, 6000);
});

test(`A new member 
    -updateSessionInfoAttendees`, () => {
      const expectedMessage =
          `The following people have joined the session: ${'Miguel'} `;
      document.body.innerHTML = '';
      const sessionInfoAttendeeDiv =
          document.createElement('div');
      sessionInfoAttendeeDiv.id = 'session-info-attendees';
      document.body.appendChild(sessionInfoAttendeeDiv);
      const alertMembershipDiv =
          document.createElement('div');
      alertMembershipDiv.id = 'alert-membership';
      document.body.appendChild(alertMembershipDiv);
      sessionscript.updateSessionInfoAttendees(['Jessica', 'Bryan', 'Miguel'], 'Jessica');
      expect(notifyOfChangesToMembershipSpy).
          toHaveBeenCalledWith(expectedMessage);
      expect(buildAttendeeDivSpy).toBeCalledTimes(3);
      expect(buildAttendeeDivSpy).toHaveBeenCalledWith('Jessica', 'Jessica');
      expect(buildAttendeeDivSpy).toHaveBeenCalledWith('Bryan', 'Jessica');
      expect(buildAttendeeDivSpy).toHaveBeenCalledWith('Miguel', 'Jessica');
});

test(`A member that has left
    -updateSessionInfoAttendees`, () => {
      const expectedMessage =
          `The following people have left the session: ${'Bryan'} `;
      document.body.innerHTML = '';
      const sessionInfoAttendeeDiv =
          document.createElement('div');
      sessionInfoAttendeeDiv.id = 'session-info-attendees';
      document.body.appendChild(sessionInfoAttendeeDiv);
      const alertMembershipDiv =
          document.createElement('div');
      alertMembershipDiv.id = 'alert-membership';
      document.body.appendChild(alertMembershipDiv);
      const sessionSpy = 
          jest.spyOn(Session.prototype, 'getListOfAttendees').
              mockReturnValue(['Jessica']);
      sessionscript.updateSessionInfoAttendees(['Jessica'], 'Bryan');
      expect(notifyOfChangesToMembershipSpy).
         toHaveBeenCalledWith(expectedMessage);
      expect(buildAttendeeDivSpy).toBeCalledTimes(1);
      expect(buildAttendeeDivSpy).toHaveBeenCalledWith('Jessica', 'Bryan');

    });

test(`A new member + a lost member' + 
    '-updateSessionInfoAttendees`, () => {
      const expectedMessage =
          'The following people have joined the session: ' + 'Miguel.' + 
              ' The following people have left the session: ' + 'Bryan ';
      document.body.innerHTML = '';
      const sessionInfoAttendeeDiv =
          document.createElement('div');
      sessionInfoAttendeeDiv.id = 'session-info-attendees';
      document.body.appendChild(sessionInfoAttendeeDiv);
      const alertMembershipDiv =
          document.createElement('div');
      alertMembershipDiv.id = 'alert-membership';
      document.body.appendChild(alertMembershipDiv);
      const sessionSpy = 
          jest.spyOn(Session.prototype, 'getListOfAttendees').
              mockReturnValue(['Jessica', 'Miguel']);
      sessionscript.updateSessionInfoAttendees(['Jessica', 'Miguel'], 'Jessica');
      expect(notifyOfChangesToMembershipSpy).
          toHaveBeenCalledWith(expectedMessage);
      expect(buildAttendeeDivSpy).toBeCalledTimes(2);
      expect(buildAttendeeDivSpy).toBeCalledWith('Jessica', 'Jessica');
      expect(buildAttendeeDivSpy).toBeCalledWith('Miguel', 'Jessica');
});

test(`no update 
    '-updateSessionInfoAttendees`, () => {
      document.body.innerHTML = '';
      const sessionInfoAttendeeDiv =
          document.createElement('div');
      sessionInfoAttendeeDiv.id = 'session-info-attendees';
      document.body.appendChild(sessionInfoAttendeeDiv);
      sessionscript.updateSessionInfoAttendees(['Jessica', 'Bryan'], 'Bryan');
      expect(buildAttendeeDivSpy).toBeCalledWith('Jessica', 'Bryan');
      expect(buildAttendeeDivSpy).toBeCalledWith('Bryan', 'Bryan');
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
