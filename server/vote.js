const router = require('express-promise-router')();

const db = require('./db');

module.exports = router;

router.get('/:hoodIds', async (req, res) => {
  const hoodIds = req.params.hoodIds.split(',');
  const sql = `
    SELECT
      neighborhood_id,
      hood_user_id
    FROM vote
    WHERE
      neighborhood_id = ANY ($1)
  `;
  const results = await db.query(sql, [hoodIds]);

  if (results.rows.length === 0) {
    return res.json({ votes: {} });
  }

  const votes = hoodIds.reduce((acc, hoodId) => {
    acc[hoodId] = results.rows
      .filter((res) => res.neighborhood_id === hoodId)
      .map((res) => res.hood_user_id)
    return acc;
  }, {});

  return res.json({ votes });
});

router.post('/:hoodId/:userId', async (req, res) => {
  const hoodId = req.params.hoodId;
  const userId = req.params.userId;

  const sql = `
    INSERT INTO vote (hood_user_id, neighborhood_id)
    VALUES ($1, $2)
  `;

  const results = await db.query(sql, [userId, hoodId]);

  const votes = { [hoodId]: [userId] };
  return res.json({ votes });
});
