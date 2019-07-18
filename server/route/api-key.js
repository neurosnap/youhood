const router = require('express-promise-router')();

const {
  getApiKeyFromRequest,
  getUserByApiKey,
  getApiKeysByUser,
} = require('../api-key');

router.get('/', async (req, res) => {
  const token = getApiKeyFromRequest(req);
  const result = await getUserByApiKey(token);

  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  const apiKeys = await getApiKeysByUser(result.user.id);
  return res.status(200).json({ apiKeys });
});

router.post('/', async (req, res) => {
  const token = getApiKeyFromRequest(req);
  const user = await getUserByApiKey(token);
  const apiKey = await createApiKeyForUser(user.id);
  return res.status(200).json({ apiKey });
});

module.exports = router;
