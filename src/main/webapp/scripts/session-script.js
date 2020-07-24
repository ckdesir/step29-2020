// RFB holds the API to connect and communicate with a VNC server   
//import RFB from 'https://cdn.jsdelivr.net/npm/@novnc/novnc@1.1.0/core/rfb.js';
import { ServerClient } from './serverclient';
import { Session } from './Session'

/**
 * Represents (in miliseconds) the cadence at which the UI is updated
 * (if needed). 
 * @type {number}
 */
const UPDATE_UI_CADENCE_MS = 30000;

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
async function main() {
  client.start();
  client.getSession().then(session => {
    changeToReadOnly(session.getSessionId());
    remoteToSession(session.getIpOfVM());
    updateUI();
  })
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
  sessionInfoInput.value = sessionId
  sessionInfoInput.readOnly = true;
  const /** HTMLElement */ welcomeMessageInput = 
      document.getElementById('welcome-message-input');
  welcomeMessageInput.value = sessionId;
  welcomeMessageInput.readOnly = true;
}

/**
 * function remoteToSession() uses the noVNC library
 * in order to connect to a session.
 */
function remoteToSession() {
  client.getSession().then(session => {
    const /** string */ url =
      `wss://${session.getIpOfVM()}:6080`;
    sessionScreen = new RFB(document.getElementById('session-screen'), url,
        { credentials: { password: 'session' } });
    sessionScreen.addEventListener('connect', connectedToServer);
    sessionScreen.addEventListener('disconnect', disconnectedFromServer);
    sessionScreen.viewOnly = true;
    document.getElementById('welcome-message').style.display = 'block';
  });
}

/**
 * function updateUI() refreshes information client side, 
 * updating the UI in checking for new attendees and for
 * whoever the controller is.
 */
function updateUI() {
  updateController();
  setTimeout(() => {
    updateUI();
  }, UPDATE_UI_CADENCE_MS);
}

/**
 * function updateController() checks to see if the current user should
 * be the controller of their party, changing session screen privilege
 * and updating user interface.
 */
function updateController() {
  client.getSession().then(session => {
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
    sessionInfoAttendeesDiv.querySelector(`#${session.
        getScreenNameOfController()}`)
            .parentElement.querySelector('span').style.
                backgroundColor = '#fd5d00';
  });
}

/**
 * If the current controller of the session clicks on the controller 
 * toggle, their controller status is revoked and the server is updated
 * with information on the new controller.
 * @param {MouseEvent} event
 */
async function passController(event) {
  let session = await client.getSession();
  client.getSession().then(session => {
    if (urlParameters.get('name') === 
      session.getScreenNameOfController()) {
        //sessionScreen.viewOnly = true;
        console.log(event.target.parentElement.querySelector('h3').id);
        client.passController(
            event.target.parentElement.querySelector('h3').id);
      }
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
  connectedToServer, disconnectedFromServer, changeToReadOnly };
