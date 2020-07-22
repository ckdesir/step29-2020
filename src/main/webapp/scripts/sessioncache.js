import { Poller } from './poller';
import { Session } from './session';

/** 
 * SessionCache bridges the gap between the client and server.
 * Allows client to indirectly stay in contact with the server,
 * encapsulating many of the contact points away from the client.
 * 
 * SessionCache looks for information about the current session and
 * updates the server with information about each client in return (like
 * date last contacted).
 */
class SessionCache {
  /**
   * Initalizes a SessionCache object.
   * @param {URLSearchParams} urlParams Represents the URLSearchParams 
   *    of the session the client is in, holds information such as the
   *    session ID and the screen name of the current user.
   * @param {number=} [refreshCadence = 30000] Represents the cadence at
   *    which the Session object is refreshed. By default, the rate is
   *    30,000 milliseconds (or 30 seconds).  
   */
  constructor(urlParams, refreshCadence = 30000) {
    /**
     * function sessionRequest_() is the fetch api request
     * responsible for contacting the server to retrieve the Session
     * object.
     * @return {Promise<any>} Promise of server response
     * @private
     */
    async function sessionRequest_() {
      const /** string */ name = encodeURI(urlParams.get('name'));
      const /** string */ sessionID = 
          encodeURI(urlParams.get('session-id'));
      const /** Response */ response = await fetch(
          `/get-session-info?name=${name}&session-id=${sessionID}`);
      return await response.json();
    }

    /** 
     * Poller responsible for contacting the server to retrieve the Session
     * object.
     * @private {Poller} 
     */
    this.sessionPoller_ = 
        new Poller(sessionRequest_, refreshCadence);
  }

  /** 
   * This method begins polling for the Session object.
   */
  start() {
    this.sessionPoller_.start();
  }

  /** 
   * This method stops polling for the Session object.
   */
  stop() {
    this.sessionPoller_.stop();
  }

  /**
   * Returns a promise containing the Session object, given how updated the 
   * cache is in refreshing.
   * @return {Promise} The Promise object
   */
  async getSession() {
    const /** ?Object */ session =
        await this.sessionPoller_.getLastResult();
    return new Promise((resolve, reject) => {
      if(session) {
        resolve(Session.fromObject(session));
      } else {
        reject(new Error('No contact with server.'));
      }
    });
  }
}

export { SessionCache };
