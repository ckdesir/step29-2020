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
   * @param {Object} urlParams Represents the URLSearchParams of the
   *    session the client is in, holds information such as the
   *    session ID and the screen name of the current user.
   * @param {number=} [refreshCadence = 30000] Represents the cadence at
   *    which the sessionInformation is refreshed. By default, the rate is 
   *    30,000 milliseconds (or 30 seconds).  
   */
  constructor(urlParams, refreshCadence = 30000) {
    /** 
     * Poller responsible for contacting the server for information about
     * the current session.
     * @private {Object} 
     */
    this.sessionInformationPoller_ = null;

    /**
     * Holds what is being tracked by the SessionCache, the
     * information about the session.
     * @private {Object}
     */
    this.sessionInformation_ = null;

    /**
     * @private {number}
     */
    this.refreshCadence_ = refreshCadence;

    /**
     * @private {Object}
     */
    this.urlParams_ = urlParams;
  }

  /**
   * Refreshes the result from the session information poller 
   * and updates the sessionInformation field.
   * Keys are updated every 30 seconds.
   * @private
   */
  refreshSessionInformation_() {
    throw new Error('Unimplemented');
  }

  /** 
   * This method begins polling for session information and starts
   * refreshing.
   */
  start() {
    throw new Error('Unimplemented');
  }

  /** 
   * This method stops polling for session information and stops
   * refreshing.
   */
  stop() {
    throw new Error('Unimplemented');
  }

  /**
   * Method sessionInformationRequest_() is the fetch api request
   * responsible for gathering information about the current session 
   * the client is in.
   * @private
   */
  sessionInformationRequest_() {
    throw new Error('Unimplemented');
  }

  /**
   * Returns information about the session, given how updated the 
   * cache is in refreshing.
   * @return {Object} The Session object.
   */
  getSessionInformation() {
    throw new Error('Unimplemented');
  }
}

export { SessionCache };
