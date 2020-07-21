import * as functions from './session-script';

test('We can check if correct errors are thrown -refresh', () => {
  try {
    functions.refresh();
  } catch (e) {
    expect(e.message).toBe('Unimplemented');
  }
});

test('We can check if correct errors are thrown -remoteToSession', () => {
  try {
    functions.remoteToSession();
  } catch (e) {
    expect(e.message).toBe('Unimplemented');
  }
});

test('We can check if correct errors are thrown' + 
    '-updateSessionInfoAttendees', () => {
      try {
        functions.updateSessionInfoAttendees();
      } catch (e) {
        expect(e.message).toBe('Unimplemented');
      }
});

test('We can check if correct errors are thrown' + 
    '-updateController', () => {
      try {
        functions.updateController();
      } catch (e) {
        expect(e.message).toBe('Unimplemented');
      }
});

test('We can check if correct errors are thrown' + 
    '-changeController', () => {
      try {
        functions.changeController();
      } catch (e) {
        expect(e.message).toBe('Unimplemented');
      }
});
