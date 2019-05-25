const sgMail = require('@sendgrid/mail');

const SENDGRID_KEY = process.env.SENDGRID_API_KEY;
console.log('SENDGRID_KEY', SENDGRID_KEY);
sgMail.setApiKey(SENDGRID_KEY);

/*
const msg = {
  to: email,
  from: 'admin@youhood.io',
  subject: 'YouHood',
  text: `Thanks for signing up to YouHood!\n\n  Click link to verify ${link}`,
  html: `Thanks for signing up to YouHood!<br /><br />  <a href=${link}>Click link to verify</a>`,
};
*/
function sendEmail(msg) {
  if (SENDGRID_KEY) {
    sgMail.send(msg);
  } else {
    console.log(msg);
  }
}

module.exports = sendEmail;
