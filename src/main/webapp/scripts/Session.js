/** Attendee Class */
class Session { 
    constructor(sessionId, ipOfVM, listOfAttendees, screenNameOfController) { 
        /** @private {string} */
        this.sessionId_ = sessionId ;

        /** @private {string} */
        this.ipOfVM_ = ipOfVM;

        /** @private {string} */
        this.listOfAttendees_ = listOfAttendees;

        /** @private  {string} */
        this.screenNameOfController_ = screenNameOfController ; 
    
    } 

    getSessionId() {
        return this.sessionId;
    } 

    getIpOfVM() {
        return this.ipOfVM;
    } 

    getListOfAttendees() { 
       return this.listOfAttendees;    
    }
    
    getScreenNameOfController() {
       return this.screenNameOfController; 
    }
    /**
    * @param {Session} obj An Json Object must be passed so that the function 
     can utilize the setters to set the variables of the object into class Session
    */    
    static fromObject(obj) {   
        const session = new Session();
        session.sessionId_ = obj.sessionId;
        session.ipOfVM_ = obj.ipOfVM;
        session.listOfAttendees_ = obj.listOfAttendees;
        session.screenNameOfController_ = obj.screenNameOfController;
        return session;
    }
    
}
export { Session };