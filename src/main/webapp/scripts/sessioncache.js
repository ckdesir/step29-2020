import { Poller } from './poller';
import { Session } from './session';

/** 
 * SessionCache bridges the gap between the client and server.
 * Allows client to indirectly stay in contact with the server,
 * encapsulating many of the contact points away from the client.
 * 
 * SessionCache looks for information about the current session.
 */
class SessionCache {
  /**
   * Initalizes a SessionCache object.
   * @param {Object} urlParams Represents the URLSearchParams of the
   *    session the client is in, holds information such as the
   *    session ID and the screen name of the current user.
   * @param {number=} [refreshCadence = 30000] Represents the cadence at
   *    which the sessionInformation is refreshed. By default, the rate is
   *    30,000 milliseconds (or 30 seconds).  
   */
  constructor(urlParams, refreshCadence = 30000) {
    /**
     * Holds what is being tracked by the SessionCache, the
     * information about the session.
     * @private {Object}
     */
    this.sessionInformation_ = null;

    /**
     * @private {Object}
     */
    this.urlParams_ = urlParams;

    /**
     * function sessionInformationRequest_() is the fetch api request
     * responsible for gathering information about the current session.
     * @private
     */
    async function sessionInformationRequest_() {
      const /** string */ name = encodeURI(this.urlParams_.get('name'));
      const /** string */ sessionID = 
          encodeURI(this.urlParams_.get('session-id'));
      const /** Object */ response = await fetch(
          `/get-session-info?name=${name}&session-id=${sessionID}`);
      return await response.json();
    }

    /** 
     * Poller responsible for contacting the server for information about
     * the current session.
     * @private {Object} 
     */
    this.sessionInformationPoller_ = 
        new Poller(sessionInformationRequest_, refreshCadence);
  }

  /** 
   * This method begins polling for session information.
   */
  start() {
    this.sessionInformationPoller_.start();
  }

  /** 
   * This method stops polling for session information.
   */
  stop() {
    this.sessionInformationPoller_.stop();
  }

  /**
   * Returns information about the session, given how updated the 
   * cache is in refreshing.
   * @return {Object} The Session object.
   */
  async getSessionInformation() {
    this.sessionInformation_ = 
        await this.sessionInformationPoller_.getLastResult();
    return Session.fromObject(this.sessionInformation_);
  }
}

export { SessionCache };
