const sendNotificationEmail = require('./notification');

async function reportHood({ hoodId, reason }) {
  const text = `${hoodId} has been reported for ${reason}`;

  sendNotificationEmail({
    subject: `A hood has been reported!`,
    text,
    html: text,
  });
}

module.exports = reportHood;
