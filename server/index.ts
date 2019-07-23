import express from 'express';
import bodyParser from 'body-parser';
import debug from 'debug';

import requireAuth from './require-auth';
import socket from './socket';
import routes from './route';
import { errorMiddleware } from './error';

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
app.use(errorMiddleware);

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  log('Listening on %d', server.address().port);
});

socket(server, app);
