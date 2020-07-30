import { Session } from './session.js';

test('Check for correct value of sessionId', () => {
    const sessionId = "LYW23902"; 
    const ipOfVM = "122.01.231.25"; 
    const listOfAttendees = ["Jasmine", "Taniece", "Chris"];
    const screenNameofController = "Jaz";
    const sess = new Session(sessionId, ipOfVM, listOfAttendees, screenNameofController);  
    const id = sess.getSessionId(); 
    const ip = sess.getIpOfVM();
    const list = sess.getListOfAttendees();
    const name = sess.getScreenNameOfController();
    expect(id).toBe(sessionId); 
    expect(ip).toBe(ipOfVM);
    expect(list).toBe(listOfAttendees);
    expect(name).toBe(screenNameOfController);
}); 

test('Check for correct value of fromObject', () => {
    var obj = { 
        screenNameOfController:"Jaz",
        sessionId: "JTK614", 
        ipOfVM: "122.01.231.25", 
        listOfAttendees:["Jasmine", "Chris", "Taniece"]
    };
    const newSession = Session.fromObject(obj);
    expect(newSession.getSessionId()).toBe(obj.screenName);
});