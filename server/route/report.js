const router = require('express-promise-router')();

const reportHood = require('../report');

router.post('/:hoodId', async (req, res) => {
  const hoodId = req.params.hoodId;
  const { reason } = req.body;
  const result = await reportHood({ hoodId, reason });
  return res.json(result);
});

module.exports = router;
