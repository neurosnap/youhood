const debug = require('debug');

const db = require('./db');

const log = debug('app:vote');

async function findVote({ hoodId, userId, voteType }) {
  const sql = `
    SELECT id FROM vote WHERE hood_user_id=$1 AND neighborhood_id=$2 AND vote=$3
  `;

  const results = await db.query(sql, [
    userId,
    hoodId,
    voteType === 'upvote' ? 1 : -1,
  ]);
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
    INSERT INTO vote (hood_user_id, neighborhood_id, vote)
    VALUES ($1, $2, $3)
  `;

  await db.query(sql, [userId, hoodId, voteType === 'upvote' ? 1 : -1]);

  const votes = { [hoodId]: [userId] };
  return { votes };
}

module.exports = {
  vote,
  unvote,
  findVote,
};
