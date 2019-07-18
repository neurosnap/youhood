const uuid = require('uuid/v4');
const db = require('./db');
const { findUser } = require('./user');

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
  getApiKeysByUser,
  createApiKeyForUser,
  findOrCreateApiKey,
  getUserByApiKey,
  getApiKeyFromRequest,
};
