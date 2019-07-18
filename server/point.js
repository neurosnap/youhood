const router = require('express-promise-router')();

const db = require('./db');
const { findOrCreateUser, findUser } = require('./user');

module.exports = { router, addPoint, removePoint };

async function addPoint({ userId, hoodId, reason }) {
  if (!userId) {
    throw new Error('Must provide userId');
  }

  const user = await findOrCreateUser(userId);
  if (!user) {
    throw new Error('Could not find or create user');
  }

  const sql = `
    INSERT INTO point (hood_user_id, neighborhood_id, reason)
    VALUES($1, $2, $3)
    RETURNING *;
  `;
  const params = [userId, hoodId, reason];
  const results = await db.query(sql, params);
  return results.rows;
}

async function removePoint({ userId, hoodId }) {
  if (!userId) {
    throw new Error('Must provide userId');
  }

  const user = await findUser(userId);
  if (!user) {
    throw new Error('Could not find user');
  }

  const sql = `
    DELETE FROM point WHERE hood_user_id=$1 AND neighborhood_id=$2;
  `;
  const params = [userId, hoodId];
  const results = await db.query(sql, params);
  return results.rows;
}

module.exports = {
  removePoint,
  addPoint,
};
