import { ServerClient } from './serverclient.js';
import RFB from 'https://cdn.jsdelivr.net/npm/@novnc/novnc@1.1.0/core/rfb.js';

class novncClient {
  constructor(serverClient, reconnectCadence = 30000) {
    /**
     * Represents the current noVNC RFB object of the 
     * session, the single connection to the VNC server of the
     * VM assigned to the session.
     * @private {RFB}
     */
    this.sessionScreen_ = null; 

    /**
     * Represents the rate at which the noVNC RFB object
     * attempts to reconnect if it goes down.
     * @private {number}
     * @const
     */
    this.RECONNECT_CADENCE_MS_ = reconnectCadence;

    /**
     * Represents the ServerClient object responsible for
     * keeping up-to-date with the current session and handles many
     * of the client-to-server interactions, like passing the controller.
     * @private {ServerClient}
     */
    this.serverClient_ = serverClient;

    /**
     * Represents the current state of the sessionScreen in terms of 
     * whether or not it is connected.
     * @private {boolean}
     */
    this.isConnected_ = false;

    this.remoteToSession_;
  }

  /**
   * Method remoteToSession() uses the noVNC library
   * in order to connect to a session.
   * @param {string} ipOfVM
   * @param {string} sessionId
   */
  remoteToSession_(ipOfVM, sessionId) {
    const /** string */ url = `wss://${ipOfVM}:6080`;
    this.sessionScreen_ = 
        new RFB(document.getElementById('session-screen'), url,
            { credentials: { password: sessionId } });
    this.sessionScreen_.addEventListener('connect', connectedToSession);
    this.sessionScreen_.addEventListener('disconnect', disconnectedFromSession);
    this.sessionScreen_.viewOnly = true;
    document.getElementById('welcome-message').style.display = 'block';
  }

  /**
   * Method connectedToSession() is called on once the sessionScreen 
   * connects.
   * @private
   */
  connectedToSession_() {
    document.getElementById('session-status').style.display = 'none';
    this.isConnected_ = true;
  }

  /**
   * Method disconnectedFromSession() is called on once the sessionScreen
   * disconnects.
   * @private
   */
  disconnectedFromSession_() {
    document.getElementById('session-status').style.display = 'block';
    this.isConnected_ = false;
    let /** number */ setIntervalId = setInterval(() => {
      if(!this.isConnected_) {
        client.getSession().then(session => {
          remoteToSession(session.getIpOfVM(), session.getSessionId());
        }).catch(error => {
          window.alert(error);
        });
      } else {
        clearInterval(setIntervalId);
      }
    }, this.RECONNECT_CADENCE_MS_);
  }

  /**
   * Method changeViewOnly changes the view only of the current RFB object
   * to be opposite of what it currently is.
   */
  changeViewOnly() {
    throw new Error('Unimpleneted');
  }

  /**
   * Method getConnectionStatus returns the current status of the 
   * current RFB object.
   */
  getConnectionStatus() {
    throw new Error('Unimpleneted');
  }
}

export { novncClient }

