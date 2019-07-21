const debug = require('debug');

const db = require('./db');
const { addPoint, removePoint } = require('./point');

const log = debug('app:vote');

async function upvote(hoodId, userId) {
  const alreadyVoted = await findVote({ hoodId, userId, voteType: 'upvote' });
  if (alreadyVoted) {
    return {
      type: 'user_already_voted',
      error: 'user already upvoted hood',
      data: alreadyVoted,
    };
  }

  await unvote({ hoodId, userId });
  const payload = await vote({ hoodId, userId, voteType: 'upvote' });

  try {
    await addPoint({ hoodId, userId, reason: 'UPVOTE' });
  } catch (err) {
    log(err);
  }

  return { type: 'success', data: payload };
}

async function downvote(hoodId, userId) {
  const alreadyVoted = await findVote({ hoodId, userId, voteType: 'downvote' });
  if (alreadyVoted) {
    return {
      type: 'user_already_voted',
      error: 'user already downvoted hood',
      data: alreadyVoted,
    };
  }

  await unvote({ hoodId, userId });
  const payload = await vote({ hoodId, userId, voteType: 'downvote' });

  try {
    await removePoint({ hoodId, userId });
  } catch (err) {
    log(err);
  }

  return {
    type: 'success',
    data: payload,
  };
}

async function getVotesByHoods(hoodIds) {
  const sql = `
    SELECT
      neighborhood_id,
      hood_user_id,
      vote
    FROM vote
    WHERE
      neighborhood_id = ANY ($1)
  `;
  const results = await db.query(sql, [hoodIds]);

  if (results.rows.length === 0) {
    return { votes: {} };
  }

  const votes = hoodIds.reduce((acc, hoodId) => {
    acc[hoodId] = results.rows
      .filter((res) => res.neighborhood_id === hoodId)
      .reduce((racc, res) => {
        return {
          ...racc,
          [res.hood_user_id]: res.vote === 1 ? 'upvote' : 'downvote',
        };
      }, {});
    return acc;
  }, {});

  return { votes };
}

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
  upvote,
  downvote,
  getVotesByHoods,
  vote,
  unvote,
  findVote,
};
