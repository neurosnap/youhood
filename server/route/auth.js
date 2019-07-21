const router = require('express-promise-router')();
const debug = require('debug');

const log = debug('router:auth');

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  const result = await signin(email, password);
  log(result);

  if (result.type === 'invalid') {
    return res.status(400).json(result);
  } else if (result.type === 'email_not_found') {
    return res.status(404).json(result);
  }

  return res.json(result.data);
});

router.post('/register', async (req, res) => {
  const { currentUserId, email, password } = req.body;
  const result = await register(currentUserId, email, password);
  log(result);

  if (result.type === 'invalid') {
    return res.status(400).json(result);
  } else if (result.type === 'server_error') {
    return res.status(500).json(result);
  }

  return res.json(result.data);
});

module.exports = router;
