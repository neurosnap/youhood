const bcrypt = require('bcrypt');
const debug = require('debug');

const db = require('./db');

const log = debug('app:auth');

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
  hashFn,
  compare,
  updateHoodUserId,
  updatePointUserId,
};
