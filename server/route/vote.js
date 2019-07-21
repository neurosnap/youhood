const router = require('express-promise-router')();
const debug = require('debug');

const { removePoint } = require('../point');
const { upvote, downvote, unvote, getVotesByHoods } = require('../vote');

const log = debug('router:vote');

module.exports = router;

router.get('/:hoodIds', async (req, res) => {
  const hoodIds = req.params.hoodIds.split(',');
  await getVotesByHoods(hoodIds);
});

router.post('/:hoodId/:userId/upvote', async (req, res) => {
  const hoodId = req.params.hoodId;
  const userId = req.params.userId;
  const results = await upvote(hoodId, userId);

  if (results.type === 'user_already_voted') {
    return res.status(400).json(results);
  }

  return res.json(results.data);
});

router.post('/:hoodId/:userId/downvote', async (req, res) => {
  const hoodId = req.params.hoodId;
  const userId = req.params.userId;
  const results = await downvote(hoodId, userId);

  if (results.type === 'user_already_voted') {
    return res.status(400).json(results);
  }

  return res.json(results.data);
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
