const router = require('express-promise-router')();

const db = require('./db');
const { findOrCreateUser } = require('./user');

module.exports = router;

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
  const user = await findOrCreateUser(userId);
  if (!user) {
    return res
      .status(401)
      .json({ error: 'Could not find user' });
  }

  const { hoodId, reason } = req.body;
  const sql = `
    INSERT INTO point (hood_user_id, neighborhood_id, reason)
    VALUES($1, $2, $3)
    RETURNING *;
  `;

  const params = [userId, hoodId, reason];
  try {
    const results = await db.query(sql, params);
    return res.json({ points: results.rows });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ error: err.detail });
  }
});
