// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Represents the cadence at which the client is refreshed. 
 * Is by default 30,000 milliseconds (or 30 seconds).
 * @type {number}
 */
const REFRESH_RATE = 30000;

/**
 * This waits until the webpage loads and then it calls the
 * anonymous function, which calls main.
 */
window.onload = function() { main(); }

/**
 * function main() connects the client to a session and begins many of
 * the behind the scenes operations, like polling.
 */
function main() {
  refresh();
}

/**
 * Refreshes information client side, given how updated the server is with
 * changes. Checks for new attendees and for whoever the controller is.
 */
function refresh() {
  setTimeout(() => {
    updateSessionInfoAttendees();
  }, REFRESH_RATE);
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
  const sessionIdElement = document.getElementById('session-id-field');
  sessionIdElement.select();
  document.execCommand('copy');
  alert('Copied the text: ' + sessionIdElement.value);
}

/**
 * Adds new attendees to the session to the session info attendee div.
 * Also removes if they left the session. Alerts users of anyone
 * who has left/entered.
 */
function updateSessionInfoAttendees() {
  const sessionInfoAttendeeDiv = document.getElementById('session-info-attendee');
}

/**
 * @return {object} the div element containing all the elements representing
 *    an attendee of the session.
 * @param {string} nameOfAttendee
 */
function buildAttendeeDiv(nameOfAttendee) {
  const /** HTMLDivElement */ attendeeDiv = document.createElement('div');
  const controllerToggle = document.createElement('span');
  controllerToggle.id = 'controller-toggle';
  controllerToggle.addEventListener('click', changeController);
  const attendeeIcon = document.createElement('img');
  // attendeeIcon.src = 
  attendeeIcon.id = 'attendee-icon'
  const attendeeName = document.createElement('h3');
  attendeeName.innerHTML = nameOfAttendee;
  attendeeName.id = 'attendee-name'
  attendeeDiv.appendChild(controllerToggle);
  attendeeDiv.appendChild(attendeeIcon);
  attendeeDiv.appendChild(attendeeName);
  return attendeeDiv;
}

/**
 * function changeController() updates the server with information
 * about a new possible controller. If the current controller of the 
 * session clicks on the controller toggle, their controller status
 * is revoked and passed on to whoever was clicked.
 */
function changeController() {
  return;
}

module.exports = {
  openSessionInfo: openSessionInfo,
  closeSessionInfo: closeSessionInfo,
  copyTextToClipboard: copyTextToClipboard
};
