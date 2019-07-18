const uuid = require('uuid/v4');
const isemail = require('isemail');
const router = require('express-promise-router')();
const debug = require('debug');

const db = require('../db');
const { getHoodsByUserId, sendAll } = require('../hood');
const { findOrCreateApiKey } = require('../api-key');
const { createValidationToken, sendVerifyEmail } = require('../verify');
const {
  hashFn,
  compare,
  updateHoodUserId,
  updatePointUserId,
} = require('../auth');

const log = debug('router:hood');
const saltRounds = 10;

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  log(email, password);

  if (!isemail.validate(email)) {
    return res.status(400).json({ error: 'must provide valid email address' });
  }

  const sql = 'SELECT * FROM hood_user WHERE email=$1';

  let user;
  try {
    const result = await db.query(sql, [email]);
    user = result.rows[0];
  } catch (err) {
    log(err);
    return res.status(401).json({ error: 'could not find email' });
  }

  try {
    const result = await compare(password, user.passhash);
    if (!result) {
      throw new Error('invalid password');
    }
  } catch (err) {
    log(err);
    return res.status(401).json({ error: 'invalid password' });
  }

  delete user.passhash;

  const apiKey = await findOrCreateApiKey(user.id);
  const jso = { token: apiKey, user };
  log(jso);
  return res.json(jso);
});

router.post('/register', async (req, res) => {
  const { currentUserId, email, password } = req.body;
  const connections = req.app.get('connections');
  log(email, password);

  if (!isemail.validate(email)) {
    return res.status(400).json({ error: 'invalid email address' });
  }

  if (!password) {
    return res.status(400).json({ error: 'password must not be empty' });
  }

  let passhash;
  try {
    passhash = await hashFn(password, saltRounds);
    log(passhash);
  } catch (err) {
    log(err);
    return res.status(400).json({ error: 'could not hash password' });
  }

  const sql = `INSERT INTO hood_user(id, email, passhash)
  VALUES($1, $2, $3) RETURNING *;`;

  let newUser;
  try {
    const result = await db.query(sql, [uuid(), email, passhash]);
    newUser = result.rows[0];
    log(result);
  } catch (err) {
    log(err);
    return res
      .status(400)
      .json({ error: `could not add user to database: ${err.detail}` });
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

  return res.json({ user, token: apiKey, verifyToken });
});

module.exports = router;
