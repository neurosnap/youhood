const bcrypt = require('bcrypt');
const router = require('express-promise-router')();
const uuid = require('uuid/v4');

const db = require('./db');

const saltRounds = 10;

module.exports = router;

const hashFn = (password, salt) => new Promise((resolve, reject) => {
  bcrypt.hash(password, salt, (err, hash) => {
    if (err) reject(err);
    resolve(hash);
  });
});

const compare = (password, hash) => new Promise((resolve, reject) => {
  bcrypt.compare(password, hash, (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  const sql = "SELECT * FROM hood_user WHERE email=$1";

  let user;
  try {
    const result = await db.query(sql, [email]);
    user = result.rows[0];
  } catch (err) {
    console.log(err);
    return res
      .status(401)
      .json({ error: 'Could not find email' });
  }

  try {
    const result = await compare(password, user.passhash);
    if (!result) {
      throw new Error('Invalid password');
    }
  } catch (err) {
    console.log(err);
    return res
      .status(401)
      .json({ error: 'Invalid password' });
  }

  delete user.passhash;

  const jso = { token: uuid(), user };
  return res.json(jso);
});

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  let passhash;
  try {
    passhash = await hashFn(password, saltRounds);
    console.log(passhash);
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ error: 'Could not hash password' });
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
      .json({ error: 'Could not add user to database' });
  }

  console.log(newUser);
  const user = { id: newUser.id, email: newUser.email };
  return res.json({ user, token: uuid() });
});
