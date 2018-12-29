const { getUserByApiKey, getApiKeyFromRequest } = require('./api-key');

const devHosts = ['http://localhost:8000'];
const prodHosts = ['https://youhood.io'];
const whitelistOrigins =
  process.env.NODE_ENV === 'development' ? devHosts : prodHosts;

async function requireAuth(req, res, next) {
  const origin = req.get('origin');
  const token = getApiKeyFromRequest(req);

  if (!token && whitelistOrigins.indexOf(origin) >= 0) {
    return next();
  }

  if (!token) {
    const err = new Error('authorization token is required');
    err.status = 401;
    return next(err);
  }

  const user = await getUserByApiKey(token);
  if (user.error) {
    const err = new Error('authorization token is not valid');
    err.status = 401;
    return next(err);
  }

  return next();
}

module.exports = requireAuth;
