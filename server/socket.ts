import ws from 'ws';
import debug from 'debug';
import uuid from 'uuid/v4';
import { Express } from 'express';
import { Server } from 'http';

const { getHoods } = require('./hood');

const log = debug('app:socket');

const DEFAULT_CITY = 'ann arbor';
const DEFAULT_STATE = 'mi';

export default function init(server: Server, app: Express) {
  const wss = new ws.Server({ server });

  wss.on('connection', (socket) => {
    log('user connected');
    const id = uuid();
    const connections = app.get('connections') || {};
    connections[id] = socket;
    app.set('connections', connections);

    socket.on('message', (event) => {
      if (typeof event !== 'string') {
        throw new Error('socket can only receive events as string');
      }

      const jso = JSON.parse(event);
      log('message', jso);

      switch (jso.type) {
        case 'get-hoods':
          getHoods(socket, DEFAULT_CITY, DEFAULT_STATE);
          break;
      }

      return;
    });

    socket.on('close', () => {
      const connections = app.get('connections') || {};
      if (connections.hasOwnProperty(id)) {
        delete connections[id];
        app.set('connections', connections);
      }
    });
  });

  return wss;
}
