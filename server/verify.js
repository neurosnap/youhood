const router = require('express-promise-router')();
const uuid = require('uuid/v4');
const sgMail = require('@sendgrid/mail');

const db = require('./db');

const SENDGRID_KEY = process.env.SENDGRID_API_KEY;
console.log('SENDGRID_KEY', SENDGRID_KEY);
sgMail.setApiKey(SENDGRID_KEY);

module.exports = {
  router,
  createValidationToken,
  sendVerifyEmail,
};

router.get('/:token', async (req, res) => {
  const token = req.params.token;
  const validation = await getUserByToken(token);
  if (validation.error) {
    const err = new Error(validation.error);
    err.status = 400;
    return next(err);
  }

  const { email, userId } = validation;
  await validateUser(userId);
  return res.json({ success: `${email} has been validated!` });
});

async function createValidationToken(userId) {
  const token = uuid();
  const sql =
    'INSERT INTO email_validation (hood_user_id, token) VALUES ($1, $2);';
  await db.query(sql, [userId, token]);
  return token;
}

async function validateUser(userId) {
  const sql = 'UPDATE hood_user SET validated=TRUE WHERE id=$1;';
  await db.query(sql, [userId]);
}

async function getUserByToken(token) {
  const sql = `SELECT e.hood_user_id, u.email
    FROM email_validation as e
    INNER JOIN hood_user as u ON u.id=e.hood_user_id
    WHERE e.token=$1;`;
  const results = await db.query(sql, [token]);
  if (results.rows.length === 0) {
    return { error: 'token is not valid' };
  }

  return { userId: results.rows[0].hood_user_id, email: results.rows[0].email };
}

function sendVerifyEmail(email, token) {
  const url =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8080'
      : 'https://api.youhood.io';
  const link = `${url}/verify/${token}`;
  const msg = {
    to: email,
    from: 'admin@youhood.io',
    subject: 'YouHood verification email',
    text: `Thanks for signing up to YouHood!\n\n  Click link to verify ${link}`,
    html: `Thanks for signing up to YouHood!<br /><br />  <a href=${link}>Click link to verify</a>`,
  };
  sendEmail(msg);
}

function sendEmail(msg) {
  if (SENDGRID_KEY) {
    sgMail.send(msg);
  } else {
    console.log(msg);
  }
}
