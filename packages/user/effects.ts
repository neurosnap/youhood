import { call, put } from 'redux-saga/effects';
import { Action } from 'robodux';

import apiFetch from '@youhood/fetch';

import { actions } from './slice';
import { transformUser } from './transform';
const { addUsers } = actions;

export function* onFetchUser({ payload }: Action<string>) {
  const resp = yield call(apiFetch, `/user/${payload}`);

  if (resp.status >= 300 || resp.status < 200) {
    return;
  }

  const user = transformUser(resp.body.user);
  yield put(addUsers({ [user.id]: user }));
  return user;
}
