import * as functions from './session-script';

test('We can check if correct errors are thrown -refresh', () => {
  try {
    functions.refresh();
  } catch (e) {
    expect(e.message).toBe('Unimplemented');
  }
});

test('We can check if correct errors are thrown -remoteToSession', () => {
  try {
    functions.remoteToSession();
  } catch (e) {
    expect(e.message).toBe('Unimplemented');
  }
});

test.only('makes sure notifyOfChangesToMembership is correctly displaying message', (done) => {
  const displayMessage = 'How are you ';
  document.body.innerHTML = '';
  const alertMembershipDiv =
      document.createElement('div');
  alertMembershipDiv.id = 'alert-membership';
  document.body.appendChild(alertMembershipDiv);
  functions.notifyOfChangesToMembership(displayMessage);
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

test('We can check if correct errors are thrown' + 
    '-updateSessionInfoAttendees', () => {
      
});

test.skip('Tests to see if controller updates correctly UI wise', () => {
  document.body.innerHTML = '';
  const sessionInfoAttendeeDiv =
      document.createElement('div');
  sessionInfoAttendeeDiv.id = 'session-info-attendees';
  document.body.appendChild(sessionInfoAttendeeDiv);
  functions.buildAttendeeDiv('Jessica');
  functions.buildAttendeeDiv('Bryan');
  functions.buildAttendeeDiv('Chris');
  const urlParamSpy = 
      jest.spyOn(functions.urlParameters, 'get').
          mockReturnValue('Jessica');
  const sessionSpy = 
      jest.spyOn(functions.session, 'getScreenNameOfController').mockReturnValue('Jessica');
  functions.updateController();
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

test('We can check if correct errors are thrown' + 
    '-changeController', () => {
      try {
        functions.changeController();
      } catch (e) {
        expect(e.message).toBe('Unimplemented');
      }
});
