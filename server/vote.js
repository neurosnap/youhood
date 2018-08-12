const router = require('express-promise-router')();
const debug = require('debug');

const { addPoint, removePoint } = require('./point');
const db = require('./db');
const log = debug('app:vote');

module.exports = router;

router.get('/:hoodIds', async (req, res) => {
  const hoodIds = req.params.hoodIds.split(',');
  const sql = `
    SELECT
      neighborhood_id,
      hood_user_id,
      vote_type
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
      .reduce((racc, res) => {
        return { ...racc, [res.hood_user_id]: res.vote_type };
      }, {});
    return acc;
  }, {});

  return res.json({ votes });
});

router.post('/:hoodId/:userId/upvote', async (req, res) => {
  const hoodId = req.params.hoodId;
  const userId = req.params.userId;
  const alreadyVoted = await findVote({ hoodId, userId, voteType: 'upvote' });
  if (alreadyVoted) {
    console.log(alreadyVoted);
    return res.status(400).json({ error: 'user already upvoted hood' });
  }

  await unvote({ hoodId, userId });
  const payload = await vote({ hoodId, userId, voteType: 'upvote' });
  try {
    await addPoint({ hoodId, userId, reason: 'UPVOTE' });
  } catch (err) {
    log(err);
  }
  return res.json(payload);
});

router.post('/:hoodId/:userId/downvote', async (req, res) => {
  const hoodId = req.params.hoodId;
  const userId = req.params.userId;
  const alreadyVoted = await findVote({ hoodId, userId, voteType: 'downvote' });
  if (alreadyVoted) {
    return res.json({ error: 'user already downvoted hood' });
  }

  await unvote({ hoodId, userId });
  const payload = await vote({ hoodId, userId, voteType: 'downvote' });
  try {
    await removePoint({ hoodId, userId });
  } catch (err) {
    log(err);
  }
  return res.json(payload);
});

router.post('/:hoodId/:userId/unvote', async (req, res) => {
  const hoodId = req.params.hoodId;
  const userId = req.params.userId;
  const result = await unvote({ hoodId, userId });
  try {
    await removePoint({ hoodId, userId });
  } catch (err) {
    log(err);
  }
  return res.json(result);
});

async function findVote({ hoodId, userId, voteType }) {
  const sql = `
    SELECT id FROM vote WHERE hood_user_id=$1 AND neighborhood_id=$2 AND vote_type=$3
  `;

  const results = await db.query(sql, [userId, hoodId, voteType]);
  if (results.rows.length === 0) {
    return null;
  }

  return results.rows[0];
}

async function unvote({ hoodId, userId }) {
  try {
    const sql = `DELETE FROM vote WHERE neighborhood_id=$1 AND hood_user_id=$2`;
    await db.query(sql, [hoodId, userId]);
    return { success: 'unvoted successful' };
  } catch (err) {
    log(err);
    return { error: err.message };
  }
}

async function vote({ hoodId, userId, voteType }) {
  const sql = `
    INSERT INTO vote (hood_user_id, neighborhood_id, vote_type)
    VALUES ($1, $2, $3)
  `;

  await db.query(sql, [userId, hoodId, voteType]);

  const votes = { [hoodId]: [userId] };
  return { votes };
}
