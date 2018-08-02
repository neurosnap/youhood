const express = require('express');
const bodyParser = require('body-parser');

const socket = require('./socket');
const authRoutes = require('./auth');
const voteRoutes = require('./vote');
const pointRoutes = require('./point');
const hood = require('./hood');
const hoodRoutes = hood.router;
const user = require('./user');
const userRoutes = user.router;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  const timestamp = new Date().toISOString();
  return res.json({ timestamp });
});
app.use('/auth', authRoutes);
app.use('/vote', voteRoutes);
app.use('/hood', hoodRoutes);
app.use('/point', pointRoutes);
app.use('/user', userRoutes);

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log('Listening on %d', server.address().port);
});

socket(server, app);
