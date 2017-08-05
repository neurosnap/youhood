import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import fs from 'fs';

const app = express();
const server = http.Server(app);
const wss = new WebSocket.Server({ server });
const userFile = './data/user.json';

let geojson = { features: [] };
try {
  const file = fs.readFileSync(userFile);
  geojson = JSON.parse(file.toString());
} catch (err) {
  console.log(err);
}

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
      getHoods(socket, jso);
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