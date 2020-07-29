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
 * function updateUI() refreshes information client side, 
 * updating the UI in checking for new attendees and for
 * whoever the controller is.
 */
function updateUI() {
  setInterval(() => {
    client.getSession().then(session => {
      updateController(session.getScreenNameOfController());
    });
  }, UPDATE_UI_CADENCE_MS);
}

/**
 * function openSessionInfo() displays the div container
 * that has information about the session.
 */
function openSessionInfo() {
  document.getElementById('session-info-div').style.display = 'block'; 
}

/**
 * function updateController() checks to see if the current user should
 * be the controller of their party, changing session screen privilege
 * and updating user interface.
 * @param {string} controller
 */
function updateController(controller) {
  const /** HTMLElement */ sessionInfoAttendeesDiv =
      document.getElementById('session-info-attendees');
  const /** NodeListOf<HTMLSpanElement> */ controllerToggleList = 
      sessionInfoAttendeesDiv.querySelectorAll('span');
  if (urlParameters.get('name') === controller) {
    sessionScreen.viewOnly = false;
  }
  controllerToggleList.forEach(individualSpanElement => {
    individualSpanElement.style.backgroundColor = '#fff';
  });
  sessionInfoAttendeesDiv.querySelector(`#${controller}`)
          .parentElement.querySelector('span').style.
              backgroundColor = '#fd5d00';
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
