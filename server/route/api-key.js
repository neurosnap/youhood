const router = require('express-promise-router')();

const {
  getApiKeysFromRequest,
  createApiKeysFromRequest,
} = require('../api-key');

router.get('/', async (req, res) => {
  const result = await getApiKeysFromRequest(req);
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  return res.json({ apiKeys: result.apiKeys });
});

router.post('/', async (req, res) => {
  const apiKey = await createApiKeysFromRequest(req);
  return res.status(200).json({ apiKey });
});

module.exports = router;
