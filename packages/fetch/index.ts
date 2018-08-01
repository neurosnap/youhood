import { call } from 'redux-saga/effects';

const dev = process.env.NODE_ENV === 'development';
export const domain = dev ? 'localhost:8080' : 'api.youhood.io';

interface FetchOptions {
  auth?: boolean;
}

type ApiOpts = RequestInit & FetchOptions;

export default function*(uri: string, opts: ApiOpts = {}) {
  // const auth = typeof opts.auth === 'undefined' ? true : opts.auth;
  const options = { ...opts };
  delete options.auth;

  const url = dev ? `http://${domain}${uri}` : `https://${domain}${uri}`;

  const res = yield call(fetch, url, options);
  const body = yield call([res, 'json']);

  return { status: res.status, body };
}
