
/**
 * function updateSessionInfoAttendees() adds new attendees to the
 * session to the session info attendee div. Also removes attendees 
 * if they left the session. Alerts users of anyone who has left/entered.
 */
function updateSessionInfoAttendees() {
  throw new Error('Unimplemented');
}

/**
 * function buildAttendeeDiv() adds the div element containing
 * all the elements representing an attendee to the session info
 * attendees div.
 * @param {string} nameOfAttendee name of attendee to build
 */
function buildAttendeeDiv(nameOfAttendee) {
  const /** HTMLElement */ sessionInfoAttendeesDiv =
      document.getElementById('session-info-attendees');
  const /** HTMLDivElement */ attendeeDiv = document.createElement('div');
  const /** HTMLSpanElement */ controllerToggle = 
      document.createElement('span');
  controllerToggle.className = 'controller-toggle';
  controllerToggle.addEventListener('click', changeController);
  const /** HTMLImageElement */ attendeeIcon =
      document.createElement('img'); 
  attendeeIcon.className = 'attendee-icon'
  const /** HTMLHeadingElement */ attendeeName =
      document.createElement('h3');
  attendeeName.innerHTML = nameOfAttendee;
  attendeeName.className = 'attendee-name'
  attendeeName.id = nameOfAttendee;
  attendeeDiv.appendChild(controllerToggle);
  attendeeDiv.appendChild(attendeeIcon);
  attendeeDiv.appendChild(attendeeName);
  sessionInfoAttendeesDiv.appendChild(attendeeDiv);
}

/**
 * function removeAttendeeDiv() removes the div element containing
 * all the elements an attendee from the session info attendees div
 * based off the name passed in.
 * @param {string} nameOfAttendee name of attendee to delete
 */
function removeAttendeeDiv(nameOfAttendee) {
  const /** HTMLElement */ sessionInfoAttendeesDiv =
      document.getElementById('session-info-attendees');
  const /** Element */ attendeeDivNodeToRemove =
      sessionInfoAttendeesDiv ? sessionInfoAttendeesDiv.querySelector(
          '#'+nameOfAttendee) : null;
  if(attendeeDivNodeToRemove) {
    sessionInfoAttendeesDiv.removeChild(attendeeDivNodeToRemove.parentNode);
  }
}

/**
 * function updateController() checks to see if the current user should
 * be the controller of their party, changing session screen privilege
 * and updating user interface.
 */
function updateController() {
  throw new Error('Unimplemented');
}

/**
 * function changeController() updates the server with information
 * about a new possible controller. If the current controller of the 
 * session clicks on the controller toggle, their controller status
 * is revoked and passed on to whoever was clicked.
 */
function changeController() {
  throw new Error('Unimplemented');
}

/**
 * function openSessionInfo() displays the div container
 * that has information about the session.
 */
function openSessionInfo() {
  document.getElementById('session-info-div').style.display = 'block'; 
}

/**
 * function closeSessionInfo() closes the div container
 * that has information about the session.
 */
function closeSessionInfo() {
  document.getElementById('session-info-div').style.display = 'none';
}

/**
 * function copyTextToClipboard() copies the text in the input field
 * with the id 'session-id-field' into the clipboard.
 */
function copyTextToClipboard() {
  const /** HTMLElement */ sessionIdElement =
      document.getElementById('session-id-field');
  sessionIdElement.select();
  document.execCommand('copy');
}

module.exports = {
  openSessionInfo: openSessionInfo,
  closeSessionInfo: closeSessionInfo,
  copyTextToClipboard: copyTextToClipboard
};
