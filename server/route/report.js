const router = require('express-promise-router')();

const sendNotificationEmail = require('../notification');

router.post('/:hoodId', async (req, res) => {
  const hoodId = req.params.hoodId;
  const data = req.body;
  const reason = data.reason;
  const text = `${hoodId} has been reported for ${reason}`;

  sendNotificationEmail({
    subject: `A hood has been reported!`,
    text,
    html: text,
  });

  res.json({ success: true });
});

module.exports = router;
