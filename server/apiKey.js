const uuid = require('uuid/v4');
const router = require('express-promise-router')();

const db = require('./db');
const { findUser } = require('./user');

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

async function getApiKeysByUser(userId) {
  const sql = `SELECT id, api_key, is_valid, label, created_at
    FROM api_keys
    WHERE hood_user_id=$1
    ORDER BY created_at DESC
  `;

  const results = await db.query(sql, [userId]);
  return results.rows;
}

async function getValidApiKeysByUser(userId) {
  const sql = `SELECT api_key
    FROM api_keys
    WHERE hood_user_id=$1 AND is_valid=TRUE
    ORDER BY created_at DESC
  `;

  const results = await db.query(sql, [userId]);
  return results.rows;
}

async function createApiKeyForUser(userId) {
  const apiKey = uuid();
  const sql = `INSERT INTO
    api_keys (hood_user_id, api_key)
    VALUES ($1, $2);
  `;

  await db.query(sql, [userId, apiKey]);
  return apiKey;
}

async function findOrCreateApiKey(userId) {
  const apiKeys = await getValidApiKeysByUser(userId);
  if (apiKeys.length > 0) {
    return apiKeys[0].api_key;
  }

  const apiKey = await createApiKeyForUser(userId);
  return apiKey;
}

async function getUserByApiKey(apiKey) {
  const sql = `SELECT hood_user_id FROM api_keys WHERE api_key=$1 AND is_valid=TRUE;`;
  const results = await db.query(sql, [apiKey]);
  if (results.rows.length === 0) {
    return { error: 'api key is not valid or not found' };
  }
  const userId = results.rows[0].hood_user_id;
  const result = await findUser(userId);
  return { user: result.user };
}

function getApiKeyFromRequest(req) {
  const auth = req.headers['authorization'];
  const token = auth ? auth.replace('Bearer', '').trim() : '';
  return token;
}

module.exports = {
  router,
  getApiKeysByUser,
  createApiKeyForUser,
  findOrCreateApiKey,
  getUserByApiKey,
  getApiKeyFromRequest,
};
