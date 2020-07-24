import { ServerClient } from './serverclient';

test('We can check if correct errors are thrown - passController', () => {
  try {
    const client = new ServerClient();
    client.passController('Bob');
  } catch (e) {
    expect(e.message).toBe('Unimplemented');
  }
});

test('We can check if correct errors are thrown - getSession', () => {
  try {
    const client = new ServerClient();
    client.getSession();
  } catch (e) {
    expect(e.message).toBe('Unimplemented');
  }
});
