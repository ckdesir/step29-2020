import * as sessionscript from './session-script';
import { Session } from './Session';

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

  openSessionInfo();

  expect(div.style.display).toEqual('block');
});

test('display block to none', () => {
  document.body.innerHTML = '<div id="container"></div>';
  const container = document.getElementById('container');
  const div = document.createElement('div');
  div.style.display = 'block';
  div.id = 'session-info-div';

  container.appendChild(div);

  closeSessionInfo();

  expect(div.style.display).toEqual('none');
});

test('change display using both functions - open then close', () => {
  document.body.innerHTML = '<div id="container"></div>';
  const container = document.getElementById('container');
  const div = document.createElement('div');
  div.style.display = 'none';
  div.id = 'session-info-div';

  container.appendChild(div);

  openSessionInfo();
  closeSessionInfo();

  expect(div.style.display).toEqual('none');
});

test('already opened', () => {
  document.body.innerHTML = '<div id="container"></div>';
  const container = document.getElementById('container');
  const div = document.createElement('div');
  div.style.display = 'block';
  div.id = 'session-info-div';

  container.appendChild(div);

  openSessionInfo();

  expect(div.style.display).toEqual('block');
});

test('tests copy and paste', () => {
  document.body.innerHTML = '<div id="container"></div>';
  const container = document.getElementById('container');
  const input = document.createElement('input');
  input.id = 'session-id-field';
  input.name = 'session-id';
  input.value = 'hello!';
  input.addEventListener('click', copyTextToClipboard);

  container.appendChild(input);

  document.execCommand = jest.fn();
  input.click();

  expect(document.execCommand).toHaveBeenCalledWith('copy');
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
      sessionscript.updateSessionInfoAttendees(
          ['Jessica', 'Bryan', 'Miguel'], 'Jessica');
      expect(notifyOfChangesToMembershipSpy).
          toHaveBeenCalledWith(expectedMessage);
      expect(buildAttendeeDivSpy).toBeCalledTimes(3);
      expect(buildAttendeeDivSpy).
          toHaveBeenCalledWith('Jessica', 'Jessica');
      expect(buildAttendeeDivSpy).
          toHaveBeenCalledWith('Bryan', 'Jessica');
      expect(buildAttendeeDivSpy).
          toHaveBeenCalledWith('Miguel', 'Jessica');
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
      sessionscript.updateSessionInfoAttendees(
          ['Jessica', 'Miguel'], 'Jessica');
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
      sessionscript.updateSessionInfoAttendees(
          ['Jessica', 'Bryan'], 'Bryan');
      expect(buildAttendeeDivSpy).toBeCalledWith('Jessica', 'Bryan');
      expect(buildAttendeeDivSpy).toBeCalledWith('Bryan', 'Bryan');
});
