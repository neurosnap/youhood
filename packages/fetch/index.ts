import { call } from 'redux-saga/effects';

const domain = '';

interface FetchOptions {
  auth?: boolean;
}

type ApiOpts = RequestInit & FetchOptions;

export default function* (uri: string, opts: ApiOpts = {}) {
  // const auth = typeof opts.auth === 'undefined' ? true : opts.auth;
  const options = { ...opts };
  delete options.auth;

  const url = `${domain}${uri}`;

  const res = yield call(fetch, url, options);
  const body = yield call([res, 'json']);

  return { status: res.status, body };
}
