import { ServerClient } from './serverclient.js';

class novncClient {
  constructor(serverClient, reconnectCadence = 30000) {
    this.sessionScreen 
    this.RECONNECT_CADENCE_MS_ = reconnectCadence;
    this.serverClient_ = serverClient;
    this.isConnected_ = false;
  }

  /**
   * Method connectedToSession() is called on once the session connects.
   * @private
   */
  connectedToSession_() {
    document.getElementById('session-status').style.display = 'none';
    this.isConnected_ = true;
  }

  /**
   * function disconnectedFromSession() is called on once the session
   * disconnects.
   */
  disconnectedFromSession() {
    document.getElementById('session-status').style.display = 'block';
    isConnected = false;
    let /** number */ setIntervalId = setInterval(() => {
      if(!isConnected) {
        client.getSession().then(session => {
          remoteToSession(session.getIpOfVM(), session.getSessionId());
        }).catch(error => {
          window.alert(error);
        });
      } else {
        clearInterval(setIntervalId);
      }
    }, SESSION_REFRESH_CADENCE_MS);
  }
}

