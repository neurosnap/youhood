const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');
const debug = require('debug');

const db = require('./db');
const { getHoods } = require('./hood');

const log = debug('server:socket');

function init(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (socket) => {
    log('user connected');

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
  });
}

module.exports = init;
