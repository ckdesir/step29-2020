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
