const express = require('express');
const bodyParser = require('body-parser');
const debug = require('debug');

const requireAuth = require('./require-auth');
const socket = require('./socket');
const auth = require('./auth');
const authRoutes = auth.router;
const voteRoutes = require('./vote');
const point = require('./point');
const pointRoutes = point.router;
const hood = require('./hood');
const hoodRoutes = hood.router;
const user = require('./user');
const userRoutes = user.router;
const verify = require('./verify');
const verifyRoutes = verify.router;
const apiKeys = require('./api-key');
const apiKeyRoutes = apiKeys.router;

const app = express();
const log = debug('app:index');

if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Authorization,Origin,X-Requested-With,Content-Type,Accept',
    );
    next();
  });
}
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  const timestamp = new Date().toISOString();
  return res.json({ timestamp });
});
app.use('/auth', requireAuth, authRoutes);
app.use('/vote', requireAuth, voteRoutes);
app.use('/hood', requireAuth, hoodRoutes);
app.use('/point', requireAuth, pointRoutes);
app.use('/user', requireAuth, userRoutes);
app.use('/api-keys', requireAuth, apiKeyRoutes);
app.use('/verify', verifyRoutes);
app.use((err, req, res, net) => {
  const status = err.status || 400;
  const json = { status, error: err.message };
  log(json);
  return res.status(status).json(json);
});

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  log('Listening on %d', server.address().port);
});

socket(server, app);
