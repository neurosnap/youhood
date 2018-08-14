const WebSocket = require('ws');
const debug = require('debug');
const uuid = require('uuid/v4');

const { getHoods } = require('./hood');

const log = debug('server:socket');

function init(server, app) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (socket) => {
    log('user connected');
    const id = uuid();
    const connections = app.get('connections') || {};
    connections[id] = socket;
    app.set('connections', connections);

    socket.on('message', (event) => {
      const jso = JSON.parse(event);
      log('message', jso);

      switch (jso.type) {
        case 'get-hoods':
          getHoods(socket);
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

module.exports = init;
