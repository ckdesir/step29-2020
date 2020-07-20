import { Poller } from "./poller";

/** 
 * SessionCache bridges the gap between the client and server.
 * Allows client to indirectly stay in contact with the server,
 * encapsulating many of the contact points away from the client.
 * 
 * SessionCache looks for information about the current session and
 * updates the server with information about each client in return (like
 * date last contacted). Also includes some additional functionality, 
 * like contacting the server to update the controller of the session.
 */
class SessionCache {
  /**
   * Initalizes a SessionCache object.
   * @param {Object} urlSearchParams Represents the URLSearchParams of the
   *    session the client is in, holds information such as the
   *    session ID and the screen name of the current user.
   * @param {number=} [refreshCadence = 30000] Represents the cadence at
   *    which the sessionInformation is refreshed. By default, the rate is 
   *    30,000 milliseconds (or 30 seconds). 
   * @param {number=} [pollingCadence = 30000] Represents the 
   *    cadence at which the server is polled. By default, the rate is 
   *    30,000 milliseconds (or 30 seconds).   
   */
  constructor(urlSearchParams, refreshCadence = 30000, pollingCadence = 30000) {
    /**
     * Method sessionInformationRequest_() is the fetch api request
     * responsible for gathering information about the current session.
     * @private
     */
    async function sessionInformationRequest_() {
      const response = await fetch('https://api.exchangeratesapi.io/latest?base=USD');
      return await response.json();
    }

    /** 
     * Poller responsible for contacting the server for information about
     * the current session.
     * @private {Object} 
     */
    this.sessionPoller_ = 
        new Poller(sessionInformationRequest_, pollingCadence);
  }

  /** 
   * This method begins polling for session information.
   */
  start() {
    this.sessionPoller_.start();
  }

  /** 
   * This method stops polling for session information.
   */
  stop() {
    this.sessionPoller_.stop();
  }

  /**
   * Returns information about the session, given how updated the 
   * cache is in refreshing.
   * @return {Object} The Session object.
   */
  async getSessionInformation() {
    let condition = await this.sessionPoller_.getLastResult();
    return new Promise((resolve, reject) => {
      if(condition) {
        resolve(condition);
      } else {
        reject(new Error('No contact with server.'));
      }
    });
  }
}

export { SessionCache };
