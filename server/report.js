const router = require('express-promise-router')();
const debug = require('debug');
const sendNotificationEmail = require('./notification');

const log = debug('router:report');

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
});

module.exports = { router };
