const express = require('express');
const bodyParser = require('body-parser');

const socket = require('./socket');
const routes = require('./routes');
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
app.use(express.static('public'));

app.use('/', routes);
app.use('/auth', authRoutes);
app.use('/vote', voteRoutes);
app.use('/hood', hoodRoutes);
app.use('/point', pointRoutes);
app.use('/user', userRoutes);

const server = app.listen(8080, () => {
  console.log('Listening on %d', server.address().port);
});

socket(server, app);
