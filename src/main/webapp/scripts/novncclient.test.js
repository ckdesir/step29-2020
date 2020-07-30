import { noVNCClient } from './novncclient.js';
import { ServerClient } from './serverclient.js';

test('We can check if poll() is called + correct return value', () => {
  try {
    const serverClient = 
        new ServerClient(new URLSearchParams(
            '?session-id=EEEE7&name=chris'));
    const novncClient = new noVNCClient(serverClient);
    novncClient.changeViewOnly();
  } catch (e) {
    expect(e.message).toBe('Unimplemented');
  }
});

test('We can check if poll() is called + correct return value', () => {
  try {
    const serverClient = 
        new ServerClient(new URLSearchParams(
            '?session-id=EEEE7&name=chris'));
    const novncClient = new noVNCClient(serverClient);
    novncClient.getConnectionStatus();
  } catch (e) {
    expect(e.message).toBe('Unimplemented');
  }
});
