const uuid = require('uuid/v4');
const isemail = require('isemail');
const bcrypt = require('bcrypt');
const debug = require('debug');

const db = require('./db');
const { getHoodsByUserId, sendAll } = require('./hood');
const { findOrCreateApiKey } = require('./api-key');
const { createValidationToken, sendVerifyEmail } = require('./verify');

const log = debug('app:auth');
const saltRounds = 10;

const hashFn = (password, salt) =>
  new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    });
  });

const compare = (password, hash) =>
  new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });

async function signin(email, password) {
  if (!isemail.validate(email)) {
    return {
      type: 'invalid',
      error: 'must provide valid email address',
    };
  }

  const sql = 'SELECT * FROM hood_user WHERE email=$1';

  let user;
  try {
    const result = await db.query(sql, [email]);
    user = result.rows[0];
  } catch (err) {
    return {
      type: 'email_not_found',
      error: 'could not find email',
    };
  }

  try {
    const result = await compare(password, user.passhash);
    if (!result) {
      throw new Error('invalid password');
    }
  } catch (err) {
    return {
      type: 'invalid',
      error: 'invalid password',
    };
  }

  delete user.passhash;

  const apiKey = await findOrCreateApiKey(user.id);
  const jso = {
    type: 'success',
    data: { token: apiKey, user },
  };
  return res.json(jso);
}

async function register(currentUserId, email, password) {
  const connections = req.app.get('connections');
  log(email, password);

  if (!isemail.validate(email)) {
    return {
      type: 'invalid',
      error: 'invalid email address',
    };
  }

  if (!password) {
    return {
      type: 'invalid',
      error: 'password must not be empty',
    };
  }

  let passhash;
  try {
    passhash = await hashFn(password, saltRounds);
    log(passhash);
  } catch (err) {
    return {
      type: 'server_error',
      error: 'could not hash password',
    };
  }

  const sql = `INSERT INTO hood_user(id, email, passhash)
  VALUES($1, $2, $3) RETURNING *;`;

  let newUser;
  try {
    const result = await db.query(sql, [uuid(), email, passhash]);
    newUser = result.rows[0];
    log(result);
  } catch (err) {
    return {
      type: 'server_error',
      error: `could not add user to database: ${err.detail}`,
    };
  }

  log(newUser);
  if (currentUserId) {
    await updateHoodUserId(currentUserId, newUser.id);
    await updatePointUserId(currentUserId, newUser.id);
    const geojson = await getHoodsByUserId(newUser.id);
    if (connections) {
      sendAll(Object.values(connections), { type: 'got-hoods', data: geojson });
    }
  }

  const user = { id: newUser.id, email: newUser.email };
  const apiKey = await findOrCreateApiKey(user.id);
  const verifyToken = await createValidationToken(user.id);
  sendVerifyEmail(user.email, verifyToken);

  return {
    type: 'success',
    data: { user, token: apiKey, verifyToken },
  };
}

async function updateHoodUserId(prevUserId, userId) {
  const sql = `UPDATE neighborhood SET hood_user_id=$1
  WHERE hood_user_id=$2`;

  try {
    await db.query(sql, [userId, prevUserId]);
    return {};
  } catch (err) {
    log(err);
    return { error: err.detail };
  }
}

async function updatePointUserId(prevUserId, userId) {
  const sql = `UPDATE point SET hood_user_id=$1
  WHERE hood_user_id=$2`;

  try {
    await db.query(sql, [userId, prevUserId]);
    return {};
  } catch (err) {
    log(err);
    return { error: err.detail };
  }
}

module.exports = {
  signin,
  register,
  hashFn,
  compare,
  updateHoodUserId,
  updatePointUserId,
};
