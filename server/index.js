const express = require('express');
const bodyParser = require('body-parser');
const debug = require('debug');

const requireAuth = require('./require-auth');
const socket = require('./socket');
const routes = require('./route');

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
app.use('/auth', requireAuth, routes.auth);
app.use('/vote', requireAuth, routes.vote);
app.use('/hood', requireAuth, routes.hood);
app.use('/point', requireAuth, routes.point);
app.use('/user', requireAuth, routes.user);
app.use('/api-keys', requireAuth, routes.apiKey);
app.use('/verify', routes.verify);
app.use('/report', routes.report);
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
