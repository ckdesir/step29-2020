// To be utilized when unwrapping JSON from the future servlets. Will be on the 
// client side and be used as a buffer for client to server information needed  
// for other components of Virtual Movie Night.
class Session { 
  constructor() {
      this.sessionId;
      this.ipOfVM;
      this.listOfAttendees;
      this.screenNameOfController; 
  }

  setSessionId(id) { 
      this.sessionId = id;
  }

  setIpOfVM(ip) {
      this.ipOfVM = ip;
  }

  setListOfAttendees(attendees) {
      this.listOfAttendees = attendees;
  }

  setScreenNameOfController(controller) {
      this.screenNameOfController = controller;
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
 
  static fromObject(obj) {  
      const session = new Session();
      session.setSessionId(obj.sessionId);
      session.setIpOfVM(obj.ipOfVM);
      session.setListOfAttendees(obj.listOfAttendees);
      session.setScreenNameOfController(obj.screenNameOfController);
      return session;
  }
  
}
export { Session };
