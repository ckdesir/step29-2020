 /** 
  * The Poll class checks for fresh data over a given interval by
  * periodically making API requests to a server. The Poll class can also
  * be used to periodically update the server of necessary updates. 
  * By default, polling objects poll indefinitely over a
  * period of 30 seconds.
  */
class Poll {
  /**
   * Operates on an instance of Poll.
   * @param {function(): ?Object} fetchAPIRequest Represents the API request
   *    that is polled.
   * @param {number=} [pollingTime] Represents the cadence at which 
   *    the fetchRequest is called upon. Must be provided in milliseconds
   *    and is by default 30,000 milliseconds (or 30 seconds). 
   * @param {?number=} [maxAttempts] An optional parameter, 
   *    can limit the amount of times polling occurs by the number
   *    of maxAttempts. By default, there is no limit (definited as null).
   */
  constructor(fetchAPIRequest, pollingTime = 30000, maxAttempts = null) {
    /** 
     * Represents the output of the fetchRequest function, is constantly
     * being updated. Can be null, ie in the case of if the 
     * fetchAPIRequest is meant to update the server instead of
     * checking for some new result. 
     * @private {?Object} 
     */
    // this.result_

    /**
     * @private @const {number}
     */
    // this.POLLING_TIME_

    /**
     * @private @const {number}
     */
    // this.MAX_ATTEMPTS_

    /**
     * @private {number} represents the amount of times polling has occured. 
     */
    // this.attempts_
  }

  /**
   * This method periodically executes (time dictated by pollingTime)
   * the given API request from fetchAPIRequest, updating the result.
   */ 
  poll() {
    return;
  }

  /**
   * Returns the current result of the fetchAPIRequest given how  
   * updated the poll is.
   * @return {?Object} The result.
   */
  getResult() {
    return;
  }
}
