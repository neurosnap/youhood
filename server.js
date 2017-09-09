const fs = require('fs');
const path = require('path');
const express = require('express');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const uuid = require('uuid/v4');

const app = express();
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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/leaflet.css', (req, res) => {
  const file = path.join(__dirname, 'node_modules/leaflet/dist/leaflet.css');
  return res.sendFile(file);
});

app.get('/leaflet.draw.css', (req, res) => {
  const file = path.join(__dirname, 'node_modules/leaflet-draw/dist/leaflet.draw.css');
  return res.sendFile(file);
});

app.get('/images/layers-2x.png', (req, res) => {
  return res.sendFile(path.join(__dirname, 'node_modules/leaflet/dist/images/layers-2x.png'));
});

app.get('/images/spritesheet.svg', (req, res) => {
  return res.sendFile(path.join(__dirname, 'node_modules/leaflet-draw/dist/images/spritesheet.svg'));
});

app.get('/ok', (req, res) => {
  const file = path.join(__dirname, 'public', 'index.html');
  return res.sendFile(file);
});

app.post('/auth', (req, res) => {
  const jso = { token: uuid(), user: users[1] };
  console.log('REQ: ', req.body);
  console.log('RES: ', jso);
  return res.json(jso);
  // return res.status(400).json({ error: 'Invalid email or password' });
});

app.post('/register', (req, res) => {
  return res.json(users[1]);
});

const server = app.listen(8080, () => {
  console.log('Listening on %d', server.address().port);
});
const wss = new WebSocket.Server({ server });

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
    }

    return;
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
