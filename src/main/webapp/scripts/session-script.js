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
 * Represents (in miliseconds) the cadence at which the session is
 * refreshed. 
 * @type {number}
 */
const SESSION_REFRESH_CADENCE_MS = 30000;

/**
 * Represents (in miliseconds) how long the message that alerts users
 * of any membership changes in the session is displayed. 
 * @type {number}
 */
const MESSAGE_DURATION_MS = 4000;

/**
 * Represents the URLSearchParams of the
 * the client is in, holds information such as the
 * session ID and the screen name of the current user.
 * @type {URLSearchParams}
 */
const urlParameters = new URLSearchParams(window.location.search);

/**
 * Represents the ServerClient object responsible for
 * keeping up-to-date with the current session and handles many
 * of the client-to-server interactions, like passing the controller.
 * @type {ServerClient}
 */
const client = new ServerClient(urlParameters);

/**
 * This waits until the webpage loads and then it calls the
 * anonymous function, which calls main.
 */
window.onload = function() { main(); }

/**
 * function main() connects the client to a session and begins many of
 * the behind the scenes operations, like caching.
 */
function main() {
  client.getSession().then(session => {
    remoteToSession(session.getIpOfVM(), session.getSessionId());
    updateUI();
  }).catch(error => {
    window.alert(error);
  });
}

/**
 * function updateUI() refreshes information client side, 
 * updating the UI in checking for new attendees and for
 * whoever the controller is.
 */
function updateUI() {
  setInterval(() => {
    client.getSession().then(session => {
      updateSessionInfoAttendees(session.getListOfAttendees(),
          session.getScreenNameOfController());
    });
  }, SESSION_REFRESH_CADENCE_MS);
}

/**
 * function updateSessionInfoAttendees() adds new attendees to the
 * session to the session info attendee div. Also removes attendees 
 * if they left the session. Alerts users of anyone who has left/entered.
 * @param {Array} updatedAttendees array of new attendees
 * @param {string} controller
 */
function updateSessionInfoAttendees(updatedAttendees, controller) {
  const /** Array */ newAttendees = updatedAttendees.filter(attendee => {
    return !currentAttendees.includes(attendee);
  });
  const /** Array */ attendeesThatHaveLeft = 
      currentAttendees.filter(attendee => {
        return !updatedAttendees.includes(attendee);
  });
  if (newAttendees.length > 0) {
    let /** string */ displayMessage =
        'The following people have joined the session: ' +
            newAttendees.join(', ');
    if (attendeesThatHaveLeft.length > 0) {
      displayMessage += 
          '. The following people have left the session: ' +
              attendeesThatHaveLeft.join(', ');
    }
    notifyOfChangesToMembership(displayMessage);
  } else if (newAttendees.length === 0 && attendeesThatHaveLeft.length 
        > 0) {
          let /** string */ displayMessage = 
              'The following people have left the session: ' + 
                  attendeesThatHaveLeft.join(', ');
          notifyOfChangesToMembership(displayMessage);
        }
  currentAttendees = updatedAttendees;
  const /** HTMLElement */ sessionInfoAttendeesDiv =
      document.getElementById('session-info-attendees');
  sessionInfoAttendeesDiv.innerHTML = '';
  currentAttendees.forEach(name => {
    buildAttendeeDiv(name, controller);
  });
}

/**
 * function notifyOfChangesToMembership() notifies 
 * users the message that's passed in.
 * @param {string} displayMessage message to display to users
 */
function notifyOfChangesToMembership(displayMessage) {
  displayMessage += '.';
  const alertMembershipDiv = document.getElementById('alert-membership');
  alertMembershipDiv.textContent = displayMessage;
  alertMembershipDiv.className = 'display-message';
  setTimeout(() => { 
    alertMembershipDiv.className = ''; 
  }, MESSAGE_DURATION_MS);
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
