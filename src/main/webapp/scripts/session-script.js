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
 * @type {boolean}
 */
let isNotConnected = true;

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

/**
 * If the current controller of the session clicks on the controller 
 * toggle, their controller status is revoked and the server is updated
 * with information on the new controller.
 * @param {MouseEvent} event
 */
function passController(event) {
  if (urlParameters.get('name') === 
    session.getScreenNameOfController()) {
      sessionScreen.viewOnly = true;
      // name of person clicked: event.target.parentElement.querySelector('h3').id
      // .querySelector('.attendee-name').id
      // fetch call to change
    }
}

/**
 * function connectedToServer() is called on once the session connects.
 */
function connectedToServer() {
  document.getElementById('status').display = 'none';
  isNotConnected = false;
}

/**
 * function disconnectedFromServer() is called on once the session
 * disconnects.
 */
function disconnectedFromServer() {
  isNotConnected = true;
  document.getElementById('status').display = 'block';
  document.getElementById('status').textContent = 'Reconnecting...';
  // while(isNotConnected) {
    // call on remoteToSession(session.getIpOfVM())
    // problem with this is that disconnectedFromServer
    // could be called multiple times? since everything is still disconnected
    // it client tries to connect again, this would be called
  //}
}

module.exports = {
  openSessionInfo: openSessionInfo,
  closeSessionInfo: closeSessionInfo,
  copyTextToClipboard: copyTextToClipboard
};
