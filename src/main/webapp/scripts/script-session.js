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
  //create sessionCache, grab key (is the value already populated by the time the session remotes?), remote to session
  remoteToSession();
  refresh();
}

/**
 * function remoteToSession() uses the noVNC library
 * in order to connect to a session.
 */
function remoteToSession() {
  return;
}

/**
 * function refresh() refreshes information client side, 
 * given how updated the server is with changes. 
 * Checks for new attendees and for whoever the controller is.
 */
function refresh() {
  updateController();
  updateSessionInfoAttendees();
  setTimeout(refresh(), REFRESH_RATE);
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
 * function updateSessionInfoAttendees() adds new attendees to the
 * session to the session info attendee div. Also removes attendees 
 * if they left the session. Alerts users of anyone who has left/entered.
 */
function updateSessionInfoAttendees() {
  return;
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
  // attendeeIcon.src = 
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
      sessionInfoAttendeesDiv ? sessionInfoAttendeesDiv.querySelector('#'+nameOfAttendee) : null;
  if(attendeeDivNodeToRemove) {
    sessionInfoAttendeesDiv.removeChild(attendeeDivNodeToRemove.parentNode);
  }
}
  // sessionInfoAttendeesDiv.getElementsByTagName('div');

  // const /** HTMLCollection */ allAttendeeDivs =
  //     sessionInfoAttendeesDiv.children;
  // for(let attendeeDivIndex = 0; attendeeDivIndex < 
  //   allAttendeeDivs.length; attendeeDivIndex++) {
  //     const individualAttendeeDiv = 
  //         allAttendeeDivs[attendeeDivIndex].children;
  //     for(let elementIndex = 0; elementIndex < individualAttendeeDiv.length; elementIndex++) {
  //       const element = individualAttendeeDiv[elementIndex]
  //       if(element.id && element.id === 'attendee-name' && element.innerHTML === nameOfAttendee) {
  //         sessionInfoAttendeesDiv.gg
  //         console.log('hello');
  //       }
  //     }
  //   }

/**
 * function changeController() updates the server with information
 * about a new possible controller. If the current controller of the 
 * session clicks on the controller toggle, their controller status
 * is revoked and passed on to whoever was clicked.
 */
function changeController() {
  return;
}

/**
 * function updateController() checks to see if the current user should
 * be the controller of their party, changing session screen privilege
 * and updating user interface.
 */
function updateController() {
  return;
}

export { openSessionInfo, closeSessionInfo, copyTextToClipboard, 
    buildAttendeeDiv, removeAttendeeDiv, changeController };
