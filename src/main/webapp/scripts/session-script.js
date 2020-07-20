// RFB holds the API to connect and communicate with a VNC server   
import RFB from 'https://cdn.jsdelivr.net/npm/@novnc/novnc@1.1.0/core/rfb.js';

import { SessionCache } from '../scripts/sessioncache';

/**
 * Represents (in miliseconds) the cadence at which the client is 
 * refreshed. 
 * @type {number}
 */
const REFRESH_CADENCE = 30000;

/**
 * Represents a cache of the session, keeps in contact with server for 
 * information about the current session.
 * @type {Object}
 */
let sessionCache;

/**
 * Represents information about the current session, a Session object.
 * @type {Object}
 */
let sessionInformation;

/**
 * Represents the noVNC client object; the single connection to the 
 * VNC server.
 * @type {Object}
 */
let sessionScreen;

const urlParameters = new URLSearchParams(window.location.search);

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
  sessionCache =
      new SessionCache(urlParameters);
  sessionCache.start();
  sessionCache.getSessionInformation().then(sesionObject => {
    sessionInformation = sesionObject;
  });
  remoteToSession(sessionInformation.getIpOfVM());
  // setTimeout(() => {
  //   sessionCache.getSessionInformation();
  //   remoteToSession(sessionInformation.getIpOfVM());
  // }, 5000);
  refresh();
}

/**
 * function remoteToSession() uses the noVNC library
 * in order to connect to a session.
 * @param {string} ipOfVM
 */
function remoteToSession(ipOfVM) {
  const url = `wss://${ipOfVM}:6080`;
  sessionScreen = new RFB(document.getElementById('session-screen'), url,
      { credentials: { password: 'sessionparty' } });
  sessionScreen.addEventListener('connect', connectedToServer);
  sessionScreen.addEventListener('disconnect', disconnectedFromServer);
  sessionScreen.viewOnly = true;
}

/**
 * function refresh() refreshes information client side, 
 * given how updated the server is with changes. 
 * Checks for new attendees and for whoever the controller is.
 */
function refresh() {
  sessionCache.getSessionInformation().then(sesionObject => {
    sessionInformation = sesionObject;
  });
  updateSessionInfoAttendees();
  updateController();
  setTimeout(() => {
    refresh();
  }, REFRESH_CADENCE);
}

/**
 * function updateSessionInfoAttendees() adds new attendees to the
 * session to the session info attendee div. Also removes attendees 
 * if they left the session. Alerts users of anyone who has left/entered.
 */
function updateSessionInfoAttendees() {
  throw new Error('Unimplemented');
}

/**
 * function updateController() checks to see if the current user should
 * be the controller of their party, changing session screen privilege
 * and updating user interface.
 */
function updateController() {
  const /** HTMLElement */ sessionInfoAttendeesDiv =
      document.getElementById('session-info-attendees');
  const /** NodeListOf<HTMLSpanElement> */ controllerToggleList = 
      sessionInfoAttendeesDiv.querySelectorAll('span');
  if (urlParameters.get('name') === 
    sessionInformation.getScreenNameOfController()) {
      sessionScreen.viewOnly = false;
    }
  Array.prototype.forEach.call(controllerToggleList, function(element) {
    //element.classList.add('non-controller');
    //element.style.color = '#FFF';
  });
  // sessionInfoAttendeesDiv.querySelector(
  //   '#'+sessionInformation.getScreenNameOfController()).parentElement.querySelector('span').style.color
  // change ui for controller span
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
  controllerToggle.addEventListener('click', changeController, /**AddEventListenerOptions=*/ false);
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
  // Looks for any element that has an id of the name of the attendee
  const /** Element */ attendeeDivNodeToRemove =
      sessionInfoAttendeesDiv ? sessionInfoAttendeesDiv.querySelector(
          '#'+nameOfAttendee) : null;
  if (attendeeDivNodeToRemove) {
    sessionInfoAttendeesDiv.removeChild(
        attendeeDivNodeToRemove.parentNode);
  }
}

/**
 * If the current controller of the session clicks on the controller 
 * toggle, their controller status is revoked and the server is updated
 * with information on the new controller.
 */
function changeController(event) {
  if (urlParameters.get('name') === 
    sessionInformation.getScreenNameOfController()) {
      sessionScreen.viewOnly = true;
      //fetch call to change
    }
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

export { openSessionInfo, closeSessionInfo, copyTextToClipboard, 
  buildAttendeeDiv, removeAttendeeDiv, changeController, 
  updateController, updateSessionInfoAttendees, 
  refresh, remoteToSession };
