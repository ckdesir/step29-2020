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

// RFB holds the API to connect and communicate with a VNC server   
import RFB from 'https://cdn.jsdelivr.net/npm/@novnc/novnc@1.1.0/core/rfb.js';

let sessionCache;

let sessionScreen;
// Check for inclusion both ways, if attendeeArray has someone but the session info
// does not, that person has left. If the session info has someone, but the attendee array doesn't,
// that person is new.
let attendeeArray = new Array();
let sessionInformation;
let isNotConnected = true;

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
  //two poll classes, one for session info and another for updating database
  ///object1.poll();
  //object2.poll();
  //refresh();    //uppdates value client side
}

function refresh() {
  setTimeout(() => {
    sessionInformation = sessionInformationPoll.result();
    updateController();
    updateSessionInfoAttendees();
  }, 30000);
}

//maybe also have a function outside that setTimesout, getting result

/**
 * function remoteToSession() uses the noVNC library
 * in order to connect to a session. If the current client
 * is meant to be the controller of the session, they will be
 * given those privileges. 
 */
function remoteToSession() {
  sessionInformation = sessionInformationRequest();
  const url = 'wss://'+sessionInformation.instanceIP+':6080';
  sessionScreen = new RFB(document.getElementById('session-screen'), url,
                { credentials: { password: 'sessionparty' } });
  sessionScreen.addEventListener('connect', connectedToServer);
  sessionScreen.addEventListener('disconnect', disconnectedFromServer);
  sessionScreen.addEventListener('credentialsrequired', credentialsAreRequired);
  sessionScreen.addEventListener('desktopname', updateDesktopName);
  // if(new URLSearchParams(window.location.search).get(name)===sessionInfo.controller) {
  //   rfb.viewOnly = false;
  // } else {
  //   rfb.viewOnly = true;
  // }
}

/**
 * function openSessionInfo() displays the div container
 * that has information about the session.
 */
function openSessionInfo() {
  document.getElementById('session-info-div').style.display = 'none'; 
}

function updateSessionInfoAttendees() {
  const updatedList = sessionInformation.attendeeArray;
  let toastMessageArrival = 'The following people have joined the session:';
  let toastMessageDeparture = 'The following people have left the session:';
  let toastMessageCombined;
  const newAttendees = new Array();
  const attendeesThatHaveLeft = new Array();
  for(i in updatedList) {
    if(!attendeeArray.includes(i)) {
      buildAttendeeDiv(i);
      toastMessageArrival+= ' ' + i;
      newAttendees.push(i);
    }
  }
  for(i in attendeeArray) {
    if(!updatedAttendeeArray.includes(i)) {
      removeFromAttendeeDiv(i);
      toastMessageDeparture+= ' ' + i;
      attendeesThatHaveLeft.push(i);
    }
  }
  if(newAttendees.length === 0) {
  }


}

/**
 * @return {object} the div element containing all the elements representing
 *    an attendee of the session.
 * @param {string} nameOfAttendee
 */
function buildAttendeeDiv(nameOfAttendee) {

}

/**
 * function closeSessionContainer() closes the div container
 * that has information about the session.
 */
function closeSessionInfo() {
  document.getElementById('session-info-div').style.display = 'block';
}

/**
 * function copyTextToClipboard() copies the text in the input field
 * with the id "session-id-field" into the clipboard.
 */
function copyTextToClipboard() {
  const sessionIDText = document.getElementById("session-id-field");
  sessionIDText.select();
  document.execCommand('copy');
  alert("Copied the text: " + sessionIDText.value);

}

function sessionInformationRequest() {
  const urlParams = new URLSearchParams(window.location.search);
  const requestBodyObject = new Object();
  requestBodyObject.sessionID = urlParams.get(session-id);
  const requestBody = {"sessionID": urlParams.get(session-id)};
  //contact getServlet from here, given the session ID
  const getSessionInfoRequest = 
      new Request('/get-session-info', {method: 'GET', body: requestBody});
  fetch(getSessionInfoRequest).then(response => response.json()).then(
    (sessionInfo) => {
      return sesionInfo;
    }
  );

  // fetch(getSessionInfoRequest).then(response => 
  //   {
  //   return response.json();
  //   }
  // );
}

function disconnectedFromServer(e) {
  // isNotConnected = true;
  document.getElementById('status').display = 'block';
  document.getElementById('status').textContent = 'Reconnecting...';
  // while(isNotConnected)
  // logic that connects to a repalcement VM
}

// When this function is called we have
// successfully connected to a server
function connectedToServer(e) {
  document.getElementById('status').display = 'none';
  isNotConnected = false;
}
