const uuid = require('uuid/v4');
const debug = require('debug');

const db = require('./db');

const log = debug('server:users');

async function findUser(id) {
  const sql = "SELECT * FROM hood_user WHERE id=$1";

  try {
    const result = await db.query(sql, [id]);
    const user = result.rows[0];
    if (!user) {
      throw new Error('Could not find user');
    }
    return { user };
  } catch (err) {
    log(err);
    return { error: err.message };
  }
}

async function createTmpUser(id) {
  const sql = `
    INSERT INTO
      hood_user(id, is_tmp, email, passhash)
      VALUES ($1, true, $2, '')
    RETURNING *
  `;
  console.log('UUID', id);

  try {
    const result = await db.query(sql, [id, id]);
    const user = result.rows[0];
    return { user };
  } catch (err) {
    log(err);
    return { error: err.message };
  }
}

async function findOrCreateUser(userId) {
  let user = await findUser(userId);
  if (user.error) {
    user = await createTmpUser(userId);
    if (user.error) {
      return;
    }
  }

  return user;
}

module.exports = {
  findUser,
  createTmpUser,
  findOrCreateUser,
};
