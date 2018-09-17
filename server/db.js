const { Pool } = require('pg');
const debug = require('debug');

const log = debug('app:db');

const conn = {
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
  host: process.env.PGHOST,
};
log(conn);

const pool = new Pool(conn);

pool.connect((err, client, release) => {
  if (err) {
    console.log(err);
    log(err);
  } else {
    console.log('Connected to postgresql!');
  }

  release();
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
