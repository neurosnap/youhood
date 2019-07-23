const router = require('express-promise-router')();

const { validateUser, getUserByToken } = require('../verify');

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

module.exports = router;
