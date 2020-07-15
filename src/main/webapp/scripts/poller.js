 /** 
  * The Poller class repeatedly execeutes a function passed in. 
  * By default, polling objects poll indefinitely over a
  * period of 30 seconds.
  * 
  * For example, if an API request is the pollingFunction that is 
  * passed in, and is one that contacts a servlet to doGet some value, a 
  * Poller object will repeatedly doGet the value, attaching it to one of
  * its fields which can then be retrieved with getResult(). 
  * The core nature is that it executes a function over and over.
  */ 
 class Poller {
  /**
   * Initializes a Poller object.
   * @param {function(): any} pollingFunction Represents the function 
   *    that is polled.
   * @param {number=} [pollingPeriod = 30000] Represents the 
   *    cadence at which the pollingFunction is called upon. 
   *    Must be provided in milliseconds and is by default
   *    30,000 milliseconds (or 30 seconds). 
   */
  constructor(pollingFunction, pollingPeriod = 30000) {
    /** 
     * Represents the output of the pollingFunction, is constantly
     * being updated.
     * @private {?Object} 
     */
    this.result_ = null;

    /**
     * @private {number}
     */
    this.pollingPeriod_ = pollingPeriod;

    /**
     * @private {number} represents the amount of times polling has 
     *    occured. 
     */
    this.attempts_ = 0;

    this.pollingFunction_ = pollingFunction;
  }

  /**
   * This method periodically executes (time dictated by pollingPeriod)
   * the pollingFunction, updating the result.
   * @private
   */ 
  poll_() {
    throw new Error('Unimplemented');
  }

  /** 
   * This method begins polling. 
   */
  start() {
    throw new Error('Unimplemented');
  }

  /** 
   * This method stops polling, calls clearTimeout on the current poll
   * function instance.
   */
  stop() {
    throw new Error('Unimplemented');
  }

  /**
   * Returns the current result of the pollingFunction given how  
   * updated the poll is.
   * @return {?Object} The result.
   */
  getLastResult() {
    throw new Error('Unimplemented');
  }

  /**
   * Used for testing, limits the number of times the object is polled. 
   * @param {?number=} maxAttempts limits the amount of times polling 
   *    occurs by the number of maxAttempts.
   */
  testOnlySetMaxPollAttempts(maxAttempts) {
    /**
     * @private {number}
     */
    this.maxAttempts_ = maxAttempts;
  }
}

export { Poller };
