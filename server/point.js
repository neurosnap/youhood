const router = require('express-promise-router')();
const debug = require('debug');

const db = require('./db');
const { findOrCreateUser, findUser } = require('./user');

const log = debug('app:point');

module.exports = { router, addPoint, removePoint };

router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;
  const sql = `
    SELECT
      neighborhood_id,
      reason,
      created_at
    FROM point
    WHERE hood_user_id=$1
  `;

  const results = await db.query(sql, [userId]);
  return res.json({ points: results.rows });
});

router.post('/:userId', async (req, res) => {
  const userId = req.params.userId;
  const { hoodId, reason } = req.body;

  try {
    const points = await addPoint({ userId, hoodId, reason });
    return res.json({ points });
  } catch (err) {
    log(err);
    return res.status(400).json({ error: err.detail });
  }
});

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
