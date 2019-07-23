import { Request, Response, NextFunction } from 'express';
import { createError } from './error';

const { getUserByApiKey, getApiKeyFromRequest } = require('./api-key');

const devHosts = ['http://localhost:8000'];
const prodHosts = ['https://youhood.io'];
const whitelistOrigins =
  process.env.NODE_ENV === 'development' ? devHosts : prodHosts;

export default async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const origin = req.get('origin') || '';
  const token = getApiKeyFromRequest(req);

  if (!token && whitelistOrigins.indexOf(origin) >= 0) {
    return next();
  }

  if (!token) {
    return next(
      createError({ status: 401, msg: 'authorization token is required' }),
    );
  }

  const user = await getUserByApiKey(token);
  if (user.error) {
    return next(
      createError({ status: 401, msg: 'authorization token is not valid' }),
    );
  }

  return next();
}
