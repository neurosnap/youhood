const router = require('express-promise-router')();
const debug = require('debug');

const db = require('../db');
const { addPoint } = require('../point');

const log = debug('app:point');

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

module.exports = router;
