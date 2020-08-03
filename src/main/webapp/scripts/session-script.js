import { ServerClient } from './serverclient.js';
import { NoVNCClient } from './novncclient.js';

/**
 * Represents the URLSearchParams the client is in, 
 * holds information such as the session ID and 
 * the screen name of the current user.
 * @type {URLSearchParams}
 */
let urlParameters;

/**
 * Represents the ServerClient object responsible for
 * keeping up-to-date with the current session and handles many
 * of the client-to-server interactions, like changing the controller.
 * @type {ServerClient}
 */
let client;

/**
 * Surrounds the noVNC library, providing many of its functionality in the
 * context necessary for Virtual Movie Night. Allows for remoting into a
 * session, handles disconnecting and connecting, and allows one to change
 * who can interact with the virtual machines.
 * @type {NoVNCClient}
 */
let novncClient;

/**
 * Represents the current state of the novncClient in terms of whether or
 * not it is connected.
 * @type {boolean}
 */
let isConnected = false;

/**
 * Represents (in miliseconds) the cadence at which the session is
 * refreshed. 
 * @type {number}
 */
const SESSION_REFRESH_CADENCE_MS = 30000;

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
  urlParameters = new URLSearchParams(window.location.search);
  client = new ServerClient(urlParameters);
  novncClient = new NoVNCClient(
      connectCallback, disconnectCallback, 
          document.getElementById('session-screen'));
  addOnClickListenerToElements();
}

/**
 * Adds an onclick event listener to some of the elements on the
 * in-session webpage.
 */
function addOnClickListenerToElements() {
  document.getElementById('session-info-span').addEventListener('click', 
      openSessionInfo);
  document.querySelectorAll('.close').forEach(element => {
    element.addEventListener('click', event => {
      closeParentDisplay(event.target);
    });
  });
  document.querySelectorAll('.session-id-input').forEach(element => {
    element.addEventListener('click', event => {
      copyTextToClipboard(event.target);
    });
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
 * function closeParentDisplay() changes the display of the 
 * parent of the element passed in to 'none'.
 * @param {HTMLElement} element
 */
function closeParentDisplay(element) {
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
 * function connectCallback() is called on once the novncClient connects.
 */
function connectCallback() {
  document.getElementById('session-status').style.display = 'none';
  isConnected = true;
}

/**
 * function disconnectCallback() is called on once the novncClient
 * disconnects.
 */
function disconnectCallback() {
  document.getElementById('session-status').style.display = 'block';
  isConnected = false;
  let /** number */ setIntervalId = setInterval(() => {
    if(!isConnected) {
      client.getSession().then(session => {
        novncClient.remoteToSession(
            session.getIpOfVM(), session.getSessionId());
      }).catch(error => {
        window.alert(error);
      });
    } else {
      clearInterval(setIntervalId);
    }
  }, SESSION_REFRESH_CADENCE_MS);
}

export { openSessionInfo, closeParentDisplay, copyTextToClipboard, 
  addOnClickListenerToElements };
