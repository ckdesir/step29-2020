/** 
 * SessionCache bridges the gap between the client and server. 
 * Allows client to indirectly stay in contact with the server.
 */
class SessionCache {
  /**
   * Operates on an instance of SessionCache.
   * @param {Object} urlParams Represents the URLSearchParams of the
   *    session the client is in, holds information such as the
   *    session ID and the screen name of the current user.
   */
  constructor(urlParams) {
    /** 
     * Represents the output of the fetchRequest function, is constantly
     * being updated. Can be null, ie in the case of if the 
     * fetchAPIRequest is meant to update the server instead of
     * checking for some new result. 
     * @private {Object} 
     */
    //this.sessionInformationPoll_

    /** 
     * Represents the output of the fetchRequest function, is constantly
     * being updated. Can be null, ie in the case of if the 
     * fetchAPIRequest is meant to update the server instead of
     * checking for some new result. 
     * @private {Object} 
     */
    //this.trackForInactivityPoll_


    /**
     * Holds the different keys being tracked by the SessionCache and their
     * respective values.
     * @private {Object}
     */
    //this.cacheObject_

    /**
     * @private {Object}
     */
    //this.urlParams_
  }

  /**
   * Gathers the results from the various polls assigned to the keys
   * and updates their values. Keys are updated every 30 seconds.
   */
  refreshKeys_() {
    return;
  }

  /**
   * Method sessionInformationRequest_() is the fetch api request
   * responsible for gathering information about the current session
   * the client is in.
   */
  sessionInformationRequest_() {
    return;
  }

  /**
   * Method updateDatePolledRequest_() is the fetch api request responsible
   * for updating the server with the last time the currrent user polled.
   */
  updateDatePolledRequest_() {
    return;
  }

  /**
   * Returns the value of the key specified if being tracked by the SessionCache.
   * @param {string} key 
   * @return {Object} The value.
   */
  getValue(key) {
    return;
  }
}