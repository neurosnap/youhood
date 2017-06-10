import path from 'path';
import express from 'express';
import http from 'http';
import socketIO from 'socket.io';

const app = express();
const server = http.Server(app);
const io = socketIO(server);

server.listen(80);

app.get('/', (req, res) => {
  res.sendfile(path.join(__dirname, '/index.html'));
});

io.on('connection', (socket) => {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', (data) => {
    console.log(data);
  });
});
