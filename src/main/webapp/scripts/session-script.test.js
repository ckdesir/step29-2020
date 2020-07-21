import * as sessionscript from './session-script';

const buildAttendeeDivSpy =
    jest.spyOn(exportFunctions, 'buildAttendeeDiv');
const removeFromAttendeeDivSpy = 
    jest.spyOn(exportFunctions, 'removeFromAttendeeDiv');
const notifyOfChangesToMembershipSpy =
    jest.spyOn(exportFunctions, 'notifyOfChangesToMembership');

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
  const anotherContainer = document.createElement('div');
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

test.skip('makes sure notifyOfChangesToMembership is correctly displaying message', (done) => {
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

test.skip('A new member' + 
    '-updateSessionInfoAttendees', () => {
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
      const sessionSpy = 
          jest.spyOn(Session.prototype, 'getListOfAttendees').
              mockReturnValue(['Jessica', 'Bryan', 'Miguel']);
      sessionscript.buildAttendeeDiv('Jessica');
      sessionscript.buildAttendeeDiv('Bryan');
      sessionscript.updateSessionInfoAttendees();
      expect(notifyOfChangesToMembershipSpy).
          toHaveBeenCalledWith(expectedMessage);
      expect(buildAttendeeDivSpy).toBeCalledTimes(1);
      expect(removeFromAttendeeDivSpy).toBeCalledTimes(0);
});

test.skip('A lost member' + 
    '-updateSessionInfoAttendees', () => {
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
      sessionscript.buildAttendeeDiv('Jessica');
      sessionscript.buildAttendeeDiv('Bryan');
      sessionscript.updateSessionInfoAttendees();
      expect(notifyOfChangesToMembershipSpy).
          toHaveBeenCalledWith(expectedMessage);
      expect(buildAttendeeDivSpy).toBeCalledTimes(0);
      expect(removeFromAttendeeDivSpy).toBeCalledTimes(1);
      expect(removeFromAttendeeDivSpy).toBeCalledWith('Bryan');
});

test.skip('A new member + a lost member' + 
    '-updateSessionInfoAttendees', () => {
      const expectedMessage =
          `The following people have joined the session: ${'Miguel'}. 
          The folllowing people have left the session: ${'Bryan'}`;
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
      sessionscript.buildAttendeeDiv('Jessica');
      sessionscript.buildAttendeeDiv('Bryan');
      sessionscript.updateSessionInfoAttendees();
      expect(notifyOfChangesToMembershipSpy).
          toHaveBeenCalledWith(expectedMessage);
      expect(buildAttendeeDivSpy).toBeCalledTimes(1);
      expect(buildAttendeeDivSpy).toBeCalledWith('Miguel');
      expect(removeFromAttendeeDivSpy).toBeCalledTimes(1);
      expect(removeFromAttendeeDivSpy).toBeCalledWith('Bryan');
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

test(`We can check if correct errors are thrown - 
    ${'updateSessionInfoAttendees'}`, () => {
      try {
        sessionscript.updateSessionInfoAttendees();
      } catch (e) {
        expect(e.message).toBe('Unimplemented');
      }
});
