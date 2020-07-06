
/** The Poll class checks for fresh data over a given interval by
  * periodically making API requests to a server. The Poll class can also
  * be used to periodically update the server of necessary updates.
  */
class Poll {
  /**
   * Operates on an instance of Poll.
   * @param {function(): ?object} fetchAPIRequest Represents the API request
   *     that is polled.
   * @param {number=} pollingTime Represents the cadence at which 
   *     the fetchRequest is called upon. Must be provided in milliseconds
   *     and is by default 30,000 milliseconds. 
   */
  constructor(fetchAPIRequest, pollingTime = 30000) {
    /** 
     * Represents the output of the fetchRequest function, is constantly
     * being updated. Can be null if the fetchAPIRequest is meant
     * to update the server instead of checking for some new result. 
     * @private {?object} 
     */
    // this.result_
  }

  /**
   * This method periodically executes (time dictated by pollingTime)
   * the given API request from fetchAPIRequest, updating the result.
   */ 
  poll() {

  }

  /**
   * Returns the current result of the fetchAPIRequest given how
   * updated the poll is.
   * @return {?object} The result.
   */
  getResult() {

  }
}
