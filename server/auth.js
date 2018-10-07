const bcrypt = require('bcrypt');
const router = require('express-promise-router')();
const uuid = require('uuid/v4');
const isemail = require('isemail');

const db = require('./db');
const { getHoodsByUserId, sendAll } = require('./hood');
const { findOrCreateApiKey } = require('./apiKey');

const saltRounds = 10;

module.exports = {
  router,
};

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

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  if (!isemail.validate(email)) {
    return res.status(400).json({ error: 'must provide valid email address' });
  }

  const sql = 'SELECT * FROM hood_user WHERE email=$1';

  let user;
  try {
    const result = await db.query(sql, [email]);
    user = result.rows[0];
  } catch (err) {
    console.log(err);
    return res.status(401).json({ error: 'could not find email' });
  }

  try {
    const result = await compare(password, user.passhash);
    if (!result) {
      throw new Error('invalid password');
    }
  } catch (err) {
    console.log(err);
    return res.status(401).json({ error: 'invalid password' });
  }

  delete user.passhash;

  const apiKey = await findOrCreateApiKey(user.id);
  const jso = { token: apiKey, user };
  console.log(jso);
  return res.json(jso);
});

router.post('/register', async (req, res) => {
  const { currentUserId, email, password } = req.body;
  const connections = req.app.get('connections');
  console.log(email, password);

  if (!isemail.validate(email)) {
    return res.status(400).json({ error: 'invalid email address' });
  }

  if (!password) {
    return res.status(400).json({ error: 'password must not be empty' });
  }

  let passhash;
  try {
    passhash = await hashFn(password, saltRounds);
    console.log(passhash);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: 'could not hash password' });
  }

  const sql = `INSERT INTO hood_user(id, email, passhash)
  VALUES($1, $2, $3) RETURNING *;`;

  let newUser;
  try {
    const result = await db.query(sql, [uuid(), email, passhash]);
    newUser = result.rows[0];
    console.log(result);
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ error: `could not add user to database: ${err.detail}` });
  }

  console.log(newUser);
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
  return res.json({ user, token: apiKey });
});

async function updateHoodUserId(prevUserId, userId) {
  const sql = `UPDATE neighborhood SET hood_user_id=$1
  WHERE hood_user_id=$2`;

  try {
    await db.query(sql, [userId, prevUserId]);
    return {};
  } catch (err) {
    console.log(err);
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
    console.log(err);
    return { error: err.detail };
  }
}
