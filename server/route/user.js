const router = require('express-promise-router')();

const { findUser } = require('../user');

router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;
  const user = await findUser(userId);
  if (user.error) {
    return res.status(400).json(user);
  }

  return res.json(user);
});

module.exports = router;
