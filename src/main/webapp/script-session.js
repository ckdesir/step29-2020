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
 * This waits until the webpage loads and then it calls the
 * anonymous function, which calls main.
 */
window.onload = function() { main(); }

/**
 * function main() connects the client to a session
 */
function main() {
  remoteToSession();
}

/**
 * function remoteToSession() uses the noVNC library
 * in order to connect to a session. If the current client
 * is meant to be the controller of the session, they will be
 * given those privileges. 
 */
function remoteToSession() {

}

/**
 * function openAttendeeContainer() displays the div container
 * that has information on who is in the session.
 */
function openAttendeeContainer() {

}

/**
 * @return the div element containing all the elements representing
 *    an attendee of the session.
 * @param {string} nameOfAttendee
 */
function buildAttendeeDiv(nameOfAttendee) {

}

/**
 * function closeAttendeeContainer() closes the div container
 * that has information on who is in the session.
 */
function closeAttendeeContainer() {

}
