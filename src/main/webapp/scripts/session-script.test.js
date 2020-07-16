import * as functions from './session-script';

test('display none to block', () => {
  document.body.innerHTML = '<div id="container"></div>';
  const container = document.getElementById('container');
  const div = document.createElement('div');
  div.style.display = 'none';
  div.id = 'session-info-div';

  container.appendChild(div);

  functions.openSessionInfo();

  expect(div.style.display).toEqual('block');
});

test('display block to none', () => {
  document.body.innerHTML = '<div id="container"></div>';
  const container = document.getElementById('container');
  const div = document.createElement('div');
  div.style.display = 'block';
  div.id = 'session-info-div';

  container.appendChild(div);

  functions.closeSessionInfo();

  expect(div.style.display).toEqual('none');
});

test('change display using both functions - open then close', () => {
  document.body.innerHTML = '<div id="container"></div>';
  const container = document.getElementById('container');
  const div = document.createElement('div');
  div.style.display = 'none';
  div.id = 'session-info-div';

  container.appendChild(div);

  functions.openSessionInfo();
  functions.closeSessionInfo();

  expect(div.style.display).toEqual('none');
});

test('already opened', () => {
  document.body.innerHTML = '<div id="container"></div>';
  const container = document.getElementById('container');
  const div = document.createElement('div');
  div.style.display = 'block';
  div.id = 'session-info-div';

  container.appendChild(div);

  functions.openSessionInfo();

  expect(div.style.display).toEqual('block');
});

test('tests copy and paste', () => {
  document.body.innerHTML = '<div id="container"></div>';
  const container = document.getElementById('container');
  const input = document.createElement('input');
  input.id = 'session-id-field';
  input.name = 'session-id';
  input.value = 'hello!';
  input.addEventListener('click', functions.copyTextToClipboard);

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
  const controllerToggle = 
      document.createElement('span');
  controllerToggle.className = 'controller-toggle';
  controllerToggle.addEventListener('click', functions.changeController);
  const attendeeIcon =
      document.createElement('img'); 
  attendeeIcon.className = 'attendee-icon'
  const attendeeName =
      document.createElement('h3');
  attendeeName.innerHTML = 'hello';
  attendeeName.className = 'attendee-name'
  attendeeName.id = 'hello';
  attendeeDivExpected.appendChild(controllerToggle);
  attendeeDivExpected.appendChild(attendeeIcon);
  attendeeDivExpected.appendChild(attendeeName);

  functions.buildAttendeeDiv('hello');

  expect(sessionInfoAttendeeDiv.childNodes[0]).
      toEqual(attendeeDivExpected);
})

test('removing an attendee div', () => {
  document.body.innerHTML = '';

  const sessionInfoAttendeeDiv =
    document.createElement('div');
  sessionInfoAttendeeDiv.id = 'session-info-attendees';
  document.body.appendChild(sessionInfoAttendeeDiv);

  functions.buildAttendeeDiv('hello');
  functions.removeAttendeeDiv('hello');

  expect(sessionInfoAttendeeDiv.innerHTML).toBeFalsy();
})

test('removing an attendee div, already empty', () => {
  document.body.innerHTML = '';

  const sessionInfoAttendeeDiv =
    document.createElement('div');
  sessionInfoAttendeeDiv.id = 'session-info-attendees';
  document.body.appendChild(sessionInfoAttendeeDiv);

  functions.removeAttendeeDiv('hello');

  expect(sessionInfoAttendeeDiv.innerHTML).toBeFalsy();
})

test('removing a non matching attendee div', () => {
  document.body.innerHTML = '';

  const sessionInfoAttendeeDiv =
    document.createElement('div');
  sessionInfoAttendeeDiv.id = 'session-info-attendees';
  document.body.appendChild(sessionInfoAttendeeDiv);

  functions.buildAttendeeDiv('hello');
  functions.removeAttendeeDiv('hell');

  const attendeeDivExpected = document.createElement('div');
  const controllerToggle = 
      document.createElement('span');
  controllerToggle.className = 'controller-toggle';
  controllerToggle.addEventListener('click', functions.changeController);
  const attendeeIcon =
      document.createElement('img');
  attendeeIcon.className = 'attendee-icon'
  const attendeeName =
      document.createElement('h3');
  attendeeName.innerHTML = 'hello';
  attendeeName.className = 'attendee-name'
  attendeeName.id = 'hello';
  attendeeDivExpected.appendChild(controllerToggle);
  attendeeDivExpected.appendChild(attendeeIcon);
  attendeeDivExpected.appendChild(attendeeName);

  expect(sessionInfoAttendeeDiv.childNodes[0]).
      toEqual(attendeeDivExpected);
})

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

test('We can check if correct errors are thrown' + 
    '-updateSessionInfoAttendees', () => {
      try {
        functions.updateSessionInfoAttendees();
      } catch (e) {
        expect(e.message).toBe('Unimplemented');
      }
});

test('We can check if correct errors are thrown' + 
    '-updateController', () => {
      try {
        functions.updateController();
      } catch (e) {
        expect(e.message).toBe('Unimplemented');
      }
});

test('We can check if correct errors are thrown' + 
    '-changeController', () => {
      try {
        functions.changeController();
      } catch (e) {
        expect(e.message).toBe('Unimplemented');
      }
});
