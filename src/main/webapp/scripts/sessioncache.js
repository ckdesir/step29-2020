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
     * Poller responsible for contacting the server for information about
     * the current session.
     * @private {Object} 
     */
    this.sessionInformationPoller_ = 
        new Poller(this.sessionInformationRequest_, pollingCadence);

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

    this.urlSearchParams_ = urlSearchParams;
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
   * Method sessionInformationRequest_() is the fetch api request
   * responsible for gathering information about the current session.
   * @private
   */
  async sessionInformationRequest_() {
    // const /** string */ name = encodeURI(this.urlParams_.get('name'));
    // const /** string */ sessionID = 
    //     encodeURI(this.urlParams_.get('session-id'));
    // fetch('https://api.exchangeratesapi.io/latest?base=USD').then(result => {
      
    //   return result.json();
    // });
    const response = await fetch('https://api.exchangeratesapi.io/latest?base=USD');
    return await response.json();
  }

  /**
   * Returns information about the session, given how updated the 
   * cache is in refreshing.
   * @return {Object} The Session object.
   */
  async getSessionInformation() {
    this.sessionInformation_ = 
        await this.sessionInformationPoller_.getLastResult();
    return await this.sessionInformationPoller_.getLastResult();
    // this.sessionInformation_.then(function(result) {
    //   console.log(result);
    // });
    // return this.sessionInformationPoller_.getLastResult().then(function(result) {
    //   return result;
    // });
    //console.log(this.sessionInformation_);
    //return this.sessionInformation_;

    // console.log(this.sessionInformationPoller_.getLastResult());
    // this.sessionInformationPoller_.getLastResult().then(result => {
    //   return await result;
    // });
  }
}

export { SessionCache };
