const { getUserByApiKey } = require('./apiKey');

const devHosts = ['http://localhost:8000'];
const prodHosts = ['https://youhood.io'];
const whitelistOrigins =
  process.env.NODE_ENV === 'development' ? devHosts : prodHosts;

async function requireAuth(req, res, next) {
  const origin = req.get('origin');
  const auth = req.headers['authorization'];
  const token = auth ? auth.replace('Bearer', '').trim() : '';

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
