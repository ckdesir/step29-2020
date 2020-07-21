// RFB holds the API to connect and communicate with a VNC server   
//import RFB from 'https://cdn.jsdelivr.net/npm/@novnc/novnc@1.1.0/core/rfb.js';
import { SessionCache } from '../scripts/sessioncache';
import { Session } from '../scripts/session'

/**
 * Represents (in miliseconds) the cadence at which the client is 
 * refreshed. 
 * @type {number}
 */
const REFRESH_CADENCE = 30000;

/**
 * Represents (in miliseconds) how long users are alerted of any membership
 * changes in the session. 
 * @type {number}
 */
const DISPLAY_CADENCE = 4000;

/**
 * An array of who is currently in the session.
 * @type {Object}
 */
let currentAttendees = new Array();

/**
 * Represents a cache of the session, keeps in contact with server  
 * about the current session.
 * @type {Object}
 */
let sessionCache;

/**
 * Represents the current session, a Session object.
 * @type {Object}
 */
let session;

/**
 * Represents the noVNC client object; the single connection to the 
 * VNC server.
 * @type {Object}
 */
let sessionScreen;

/**
 * Represents the URLSearchParams of the
 * the client is in, holds information such as the
 * session ID and the screen name of the current user.
 * @type {Object}
 */
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
  sessionCache.getSessionInformation().then(sessionObject => {
    session = sessionObject;
  });
  initializeElements();
  remoteToSession(session.getIpOfVM());
  refresh();
}

function initializeElements() {
  const sessionIdField = 
      document.getElementById('session-info-field');
  sessionIdField.value = session.getSessionId();
  sessionIdField.readOnly = true;

  const welcomeMessageField = 
      document.getElementById('welcome-message-field');
  welcomeMessageField.value = session.getSessionId();
  welcomeMessageField.readOnly = true;

  // possibly onclicks?
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
  //display message about string of session
}

/**
 * function refresh() refreshes information client side, 
 * given how updated the server is with changes. 
 * Checks for new attendees and for whoever the controller is.
 */
function refresh() {
  sessionCache.getSessionInformation().then(sessionObject => {
    session = sessionObject;
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
  const /** Object */ updatedAttendees = session.getListOfAttendees();
  const /** Object */ newAttendees = new Array();
  const /** Object */ attendeesThatHaveLeft = new Array();
  for (const attendee of updatedAttendees) {
    if (!currentAttendees.includes(attendee)) {
      buildAttendeeDiv(attendee)
      newAttendees.push(attendee);
    }
  }
  for (const attendee of currentAttendees) {
    if (!updatedAttendees.includes(attendee)) {
      removeFromAttendeeDiv(attendee);
      attendeesThatHaveLeft.push(attendee);
    }
  }
  if (newAttendees.length) {
    let /** string */ displayMessage =
        'The following people have joined the session: ';
    for (const attendee of newAttendees) {
      displayMessage += `${attendee} `;
    }
    if (attendeesThatHaveLeft.length) {
      displayMessage += '. The following people have left the session: ';
      for (const attendee of attendeesThatHaveLeft) {
        displayMessage += `${attendee} `;
      }
    }
    notifyOfChangesToMembership(displayMessage);
  } else if (!newAttendees.length && attendeesThatHaveLeft.length) {
    let /** string */ displayMessage = 
        'The following people have left the session: ';
    for (const attendee of attendeesThatHaveLeft) {
      displayMessage += `${attendee} `;
    }
    notifyOfChangesToMembership(displayMessage);
  }
  currentAttendees = updatedAttendees;
}

/**
 * function notifyOfChangesToMembership() notifies 
 * users of anyone who has left/entered.
 * @param {string} displayMessage message to display to users
 */
function notifyOfChangesToMembership(displayMessage) {
  displayMessage = 
      `${displayMessage.substring(0, displayMessage.length-1)}.`;
  const alertMembershipDiv = document.getElementById('alert-membership');
  alertMembershipDiv.textContent = displayMessage;
  alertMembershipDiv.className = 'display-message';
  setTimeout( () => { 
    alertMembershipDiv.className = ''; 
  }, DISPLAY_CADENCE);
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
    session.getScreenNameOfController()) {
      sessionScreen.viewOnly = false;
    }
  controllerToggleList.forEach(function(individualSpanElement) {
    individualSpanElement.style.backgroundColor = '#fff';
  });
  // Looks for any element that has an id of the name of the 
  // attendee (or the header displaying the name),
  // finds the parent element (the attendee div as a whole), 
  // finds the span and changes its color.
  sessionInfoAttendeesDiv.querySelector(`#${session.
      getScreenNameOfController()}`)
          .parentElement.querySelector('span').style.
              backgroundColor = '#fd5d00';
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
  attendeeDiv.className = 'attendee-div'
  const /** HTMLSpanElement */ controllerToggle = 
      document.createElement('span');
  controllerToggle.className = 'controller-toggle';
  controllerToggle.addEventListener('click', 
      changeController, /**AddEventListenerOptions=*/ false);
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
 * function removeFromAttendeeDiv() removes the div element containing
 * all the elements an attendee from the session info attendees div
 * based off the name passed in.
 * @param {string} nameOfAttendee name of attendee to delete
 */
function removeFromAttendeeDiv(nameOfAttendee) {
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
    session.getScreenNameOfController()) {
      sessionScreen.viewOnly = true;
      // fetch call to change
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
 * function closeDisplay changes the display of the parent of the element
 * passed in to 'none'
 */
function closeDisplay(element) {
  document.getElementById(element.parentNode.id).style.display = 'none';
}

/**
 * function copyTextToClipboard() copies the text of the element passed
 * in into the clipboard.
 */
function copyTextToClipboard(element) {
  element.select();
  document.execCommand('copy');
}

function connectedToServer() {
  throw new Error('Unimplemented');
}

function disconnectedFromServer() {
  throw new Error('Unimplemented');
}

function test() {
  session = new URLSearchParams(window.location.search);
}

export { openSessionInfo, closeDisplay, copyTextToClipboard, 
  buildAttendeeDiv, removeFromAttendeeDiv, changeController, 
  updateController, updateSessionInfoAttendees, notifyOfChangesToMembership
  , refresh, remoteToSession, urlParameters, session };
