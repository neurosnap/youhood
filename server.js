const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');

const app = express();
const server = new http.Server(app);
const wss = new WebSocket.Server({ server });
const userFile = './data/user.json';

let geojson = { type: 'FeatureCollection', features: [] };
try {
  const file = fs.readFileSync(userFile);
  geojson = JSON.parse(file.toString());
} catch (err) {
  console.log(err);
}

const users = [
  { id: '1', name: 'Zillow' },
  { id: '2', name: 'Erock' },
];

server.listen(8080, () => {
  console.log('Listening on %d', server.address().port);
});

wss.on('connection', (socket) => {
  console.log('user connected');

  socket.on('message', (event) => {
    const jso = JSON.parse(event);
    console.log('message', jso);

    switch (jso.type) {
    case 'get-hoods':
      getHoods(socket);
      getUsers(socket);
      break;
    case 'save-hoods':
      saveHoods(socket, jso);
      break;
    default:
      break;
    }
  });
});

function getHoods(socket) {
  socket.send(JSON.stringify({ type: 'got-hoods', data: geojson }));
}

function getUsers(socket) {
  socket.send(JSON.stringify({ type: 'got-users', data: users }));
}

function saveHoods(socket, event) {
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
