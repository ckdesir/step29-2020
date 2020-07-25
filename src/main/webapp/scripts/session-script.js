// RFB holds the API to connect and communicate with a VNC server   
import RFB from 'https://cdn.jsdelivr.net/npm/@novnc/novnc@1.1.0/core/rfb.js';
import { ServerClient } from './serverclient.js';
import { Session } from './Session.js'

/**
 * Represents (in miliseconds) the cadence at which the UI is updated
 * (if needed). 
 * @type {number}
 */
const UPDATE_UI_CADENCE_MS = 30000;

/**
 * Represents (in miliseconds) how long the message that alerts users
 * of any membership changes in the session is displayed. 
 * @type {number}
 */
const MESSAGE_DURATION_MS = 4000;

/**
 * An array of who is currently in the session.
 * @type {Array}
 */
let currentAttendees = [];

/**
 * Represents the noVNC client object; the single connection to the 
 * VNC server.
 * @type {RFB}
 */
let sessionScreen;

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
  addOnClickToElements();
  client.getSession().then(session => {
    changeToReadOnly(session.getSessionId());
    remoteToSession(session.getIpOfVM());
    updateUI();
  });
}

/**
 * Adds an onclick event listener to some of the elements on the
 * in-session webpage.
 */
function addOnClickToElements() {
  document.getElementById('session-info-span').addEventListener('click', 
      openSessionInfo);
  document.querySelectorAll('.close').forEach(element => {
    element.addEventListener('click', event => {
      closeDisplay(event.target);
    });
  });
  document.querySelectorAll('.session-id-field').forEach(element => {
    element.addEventListener('click', event => {
      copyTextToClipboard(event.target);
    });
  });
}

/**
 * function changetoReadOnly() changes the two inputs
 * (one on the welcome message) and the other in the session 
 * information div to show the session ID and then changes them
 * to read only.
 * @param {string} sessionId
 */
function changeToReadOnly(sessionId) {
  const /** HTMLElement */ sessionInfoInput = 
  document.getElementById('session-info-input');
  sessionInfoInput.value = sessionId;
  sessionInfoInput.readOnly = true;
  const /** HTMLElement */ welcomeMessageInput = 
      document.getElementById('welcome-message-input');
  welcomeMessageInput.value = sessionId;
  welcomeMessageInput.readOnly = true;
}

/**
 * function remoteToSession() uses the noVNC library
 * in order to connect to a session.
 * @param {string} ipOfVM
 * @param {string} sessionId
 */
function remoteToSession(ipOfVM) {
  const /** string */ url = `wss://${ipOfVM}:6080`;
  sessionScreen = new RFB(document.getElementById('session-screen'), url,
      { credentials: { password: 'session' } });
  sessionScreen.addEventListener('connect', connectedToServer);
  sessionScreen.addEventListener('disconnect', disconnectedFromServer);
  sessionScreen.viewOnly = true;
  document.getElementById('welcome-message').style.display = 'block';
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
      updateController(session.getScreenNameOfController());
    });
  }, UPDATE_UI_CADENCE_MS);
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
        'The following people have joined the session: ';
    displayMessage += newAttendees.join(', ');
    if (attendeesThatHaveLeft.length > 0) {
      displayMessage = 
          displayMessage.substring(0, displayMessage.length-1) + 
              '. The following people have left the session: ';
      displayMessage += attendeesThatHaveLeft.join(', ');
    }
    notifyOfChangesToMembership(displayMessage);
  } else if (newAttendees.length === 0 && attendeesThatHaveLeft.length 
        > 0) {
          let /** string */ displayMessage = 
              'The following people have left the session: ';
          displayMessage += attendeesThatHaveLeft.join(', ');
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
  console.log(displayMessage);
  displayMessage = `${displayMessage.
      substring(0, displayMessage.length-1)}.`;
  const alertMembershipDiv = document.getElementById('alert-membership');
  alertMembershipDiv.textContent = displayMessage;
  alertMembershipDiv.className = 'display-message';
  setTimeout(() => { 
    alertMembershipDiv.className = ''; 
  }, MESSAGE_DURATION_MS);
}

/**
 * function buildAttendeeDiv() adds the div element containing
 * all the elements representing an attendee to the session info
 * attendees div.
 * @param {string} nameOfAttendee name of attendee to build
 * @param {string} controller
 */
function buildAttendeeDiv(nameOfAttendee, controller) {
  const /** HTMLElement */ sessionInfoAttendeesDiv =
      document.getElementById('session-info-attendees');
  const /** HTMLDivElement */ attendeeDiv = document.createElement('div');
  attendeeDiv.className = 'attendee-div'
  const /** HTMLSpanElement */ controllerToggle = 
      document.createElement('span');
  controllerToggle.className = 'controller-toggle';
  controllerToggle.addEventListener('click', event => {
    passController(event, controller);
  }, /**AddEventListenerOptions=*/false);
  const /** HTMLHeadingElement */ attendeeName =
      document.createElement('h3');
  attendeeName.innerHTML = nameOfAttendee;
  attendeeName.className = 'attendee-name'
  attendeeName.id = nameOfAttendee;
  attendeeDiv.appendChild(controllerToggle);
  attendeeDiv.appendChild(attendeeName);
  sessionInfoAttendeesDiv.appendChild(attendeeDiv);
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
 * If the current controller of the session clicks on the controller 
 * toggle, their controller status is revoked and the server is updated
 * with information on the new controller.
 * @param {MouseEvent} event
 * @param {string} controller
 */
function passController(event, controller) {
  if (urlParameters.get('name') === controller) {
    sessionScreen.viewOnly = true;
    client.passController(
        event.target.parentElement.querySelector('h3').id);
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
 * function closeDisplay() changes the display of the parent of the element
 * passed in to 'none'.
 * @param {HTMLElement} element
 */
function closeDisplay(element) {
  element.parentElement.style.display = 'none';
}

/**
 * function copyTextToClipboard() copies the text of the element passed
 * in into the clipboard.
 * @param {HTMLInputElement} element
 */
function copyTextToClipboard(element) {
  element.select();
  document.execCommand('copy');
}

/**
 * function connectedToServer() is called on once the session connects.
 */
function connectedToServer() {
  throw new Error('Unimplemented');
}

/**
 * function disconnectedFromServer() is called on once the session
 * disconnects.
 */
function disconnectedFromServer() {
  throw new Error('Unimplemented');
}

export { openSessionInfo, closeDisplay, copyTextToClipboard,  
  updateController, remoteToSession, passController,
  connectedToServer, disconnectedFromServer, changeToReadOnly, 
  buildAttendeeDiv, updateSessionInfoAttendees };
