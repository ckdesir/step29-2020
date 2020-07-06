// RFB holds the API to connect and communicate with a VNC server   
import RFB from 'https://cdn.jsdelivr.net/npm/@novnc/novnc@1.1.0/core/rfb.js';

let desktopName;
/**
 * This waits until the webpage loads and then it calls the
 * anonymous function, which calls main.
 */
window.onload = function() { main(); }

function main() {
  document.getElementById('remote').addEventListener ('click', hello, false);
  // window.location.href = window.location.pathname+'?'+'name=fivio'
}

function hello() {
  const params = new URLSearchParams(window.location.search);
  console.log(params)
  for (const param of params) {
  console.log(param)
  }
  console.log(params.get('name'));
}

function ID() {
//   while (true) {
    const promptForID = prompt('Enter session-id');
//     if (prompt.length()>0 /** if session-ID is valid/database of ID's contains this*/ ) {
//       break;
//     }
//     alert('Invalid Session-ID');
//   }
  remoteToVM(promptForID);
}

function remoteToVM(sessionID, owner) {
  let instanceIP;
  fetch(buildVMURL(sessionID)).then(response => response.json()).then(
        (instance) => {
            instanceIP = instance;
            console.log(instanceIP);
  });
  //const instanceIP = findInstanceIP(document.getElementById('session-id-field').value);
  const url = 'wss://'+instanceIP+':6080';
  // Creating a new RFB object will start a new connection
  status('Connecting');
  const rfb = new RFB(document.getElementById('screen'), url,
                { credentials: { password: '' } });
  // Add listeners to important events from the RFB module
  rfb.addEventListener('connect', connectedToServer);
  rfb.addEventListener('disconnect', disconnectedFromServer);
  rfb.addEventListener('credentialsrequired', credentialsAreRequired);
  rfb.addEventListener('desktopname', updateDesktopName);
  // Set parameters that can be changed on an active connection
  rfb.scaleViewport = readQueryVariable('scale', false);
  //if owner is true, view_only is false;
  rfb.viewOnly = readQueryVariable('view_only', true);
}

function buildVMURL(sessionID) {
  const vmURL = new URL(new Request('/vm').url);
  vmURL.searchParams.append('session-id', sessionID);
  return vmURL;
}

// When this function is called we have
// successfully connected to a server
function connectedToServer(e) {
  status('Connected to ' + desktopName);
}

// This function is called when we are disconnected
function disconnectedFromServer(e) {
  if (e.detail.clean) {
      status('Disconnected');
  } else {
      status('Something went wrong, connection is closed');
  }
}

// When this function is called, the server requires
// credentials to authenticate
function credentialsAreRequired(e) {
  const sessionPassword = prompt('Enter Session-ID:');
  rfb.sendCredentials({ password: sessionPassword });
}

// When this function is called we have received
// a desktop name from the server
function updateDesktopName(e) {
  desktopName = e.detail.name;
}

// Show a status text in the top bar
function status(text) {
  document.getElementById('status').textContent = text;
}

// This function extracts the value of one variable from the
// query string. If the variable isn't defined in the URL
// it returns the default value instead.
function readQueryVariable(name, defaultValue) {
  // A URL with a query parameter can look like this:
  // https://www.example.com?myqueryparam=myvalue
  //
  // Note that we use location.href instead of location.search
  // because Firefox < 53 has a bug w.r.t location.search
  const re = new RegExp('.*[?&]' + name + '=([^&#]*)'),
      match = document.location.href.match(re);
  if (typeof defaultValue === 'undefined') { defaultValue = null; }

  if (match) {
    // We have to decode the URL since want the cleartext value
    return decodeURIComponent(match[1]);
  }

  return defaultValue;
}