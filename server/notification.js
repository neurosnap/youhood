const sendEmail = require('./email');

function sendNotificationEmail({ subject, text, html }) {
  const msg = {
    to: 'notification@youhood.io',
    from: 'admin@youhood.io',
    subject,
    text,
    html,
  };

  sendEmail(msg);
}

module.exports = sendNotificationEmail;
