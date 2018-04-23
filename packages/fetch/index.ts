import { call } from 'redux-saga/effects';

export default function* (url: string, opts?: RequestInit) {
  const res = yield call(fetch, url, opts);
  const body = yield res.json();
  return { status: res.status, body };
}
