import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import fs from 'fs';

import { GeoJson, GeoJsonFeatures, WebSocketEvent } from '../types';

const app = express();
const server = new http.Server(app);
const wss = new WebSocket.Server({ server });
const userFile = './data/user.json';

let geojson: GeoJsonFeatures = { features: [] };
try {
  const file = fs.readFileSync(userFile);
  geojson = JSON.parse(file.toString());
} catch (err) {
  console.log(err);
}

server.listen(8080, () => {
  console.log('Listening on %d', server.address().port);
});

wss.on('connection', (socket: WebSocket) => {
  console.log('user connected');

  socket.on('message', (event: string) => {
    const jso = JSON.parse(event);
    console.log('message', jso);

    switch (jso.type) {
    case 'get-hoods':
      getHoods(socket);
      break;
    case 'save-hoods':
      saveHoods(socket, jso);
      break;
    default:
      break;
    }
  });
});

function getHoods(socket: WebSocket) {
  socket.send(JSON.stringify({ type: 'got-hoods', data: geojson }));
}

function saveHoods(socket: WebSocket, event: WebSocketEvent) {
  console.log(event);
  const data = event.data;

  fs.writeFile('./data/user.json', JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log('hoods saved!');
  });
}
