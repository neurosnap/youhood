import { Request, Response, NextFunction } from 'express';
import debug from 'debug';

const log = debug('app:error');

interface Props {
  status: number;
  msg: string;
}

interface ExpressError {
  status: number;
  error: Error;
}

export function errorMiddleware(
  err: ExpressError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const status = err.status || 400;
  const json = { status, error: err.error.message };
  log(json);
  return res.status(status).json(json);
}

export function createError({ status, msg }: Props): ExpressError {
  const error = new Error(msg);
  return {
    status,
    error,
  };
}
