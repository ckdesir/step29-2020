import * as functions from './script-session';

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
  const /** HTMLDivElement */ sessionInfoAttendeeDiv =
    document.createElement('div');
  sessionInfoAttendeeDiv.id = 'session-info-attendees';
  document.body.appendChild(sessionInfoAttendeeDiv);

  const /** HTMLDivElement */ attendeeDivExpected =
      document.createElement('div');
  const /** HTMLSpanElement */ controllerToggle = 
      document.createElement('span');
  controllerToggle.id = 'controller-toggle';
  controllerToggle.addEventListener('click', functions.changeController);
  const /** HTMLImageElement */ attendeeIcon =
      document.createElement('img');
  // attendeeIcon.src = 
  attendeeIcon.id = 'attendee-icon'
  const /** HTMLHeadingElement */ attendeeName =
      document.createElement('h3');
  attendeeName.innerHTML = 'hello';
  attendeeName.id = 'attendee-name'
  attendeeDivExpected.appendChild(controllerToggle);
  attendeeDivExpected.appendChild(attendeeIcon);
  attendeeDivExpected.appendChild(attendeeName);

  functions.buildAttendeeDiv('hello');

  console.log(sessionInfoAttendeeDiv.innerHTML);

  expect(sessionInfoAttendeeDiv.childNodes[0]).toEqual(attendeeDivExpected);
})

test.only('removing an attendee div', () => {
  const /** HTMLDivElement */ sessionInfoAttendeeDiv =
    document.createElement('div');
  sessionInfoAttendeeDiv.id = 'session-info-attendees';
  document.body.appendChild(sessionInfoAttendeeDiv);

  functions.buildAttendeeDiv('hello');
  functions.removeAttendeeDiv('hell');
  
  console.log(sessionInfoAttendeeDiv.innerHTML);
})
