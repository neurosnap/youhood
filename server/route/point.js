const router = require('express-promise-router')();
const debug = require('debug');

const { addPoint, getPointsForUser } = require('../point');

const log = debug('router:point');

router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;
  const points = await getPointsForUser(userId);
  return res.json({ points });
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
