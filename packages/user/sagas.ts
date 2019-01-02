import { takeEvery } from 'redux-saga/effects';

import { onFetchUser } from './effects';
import { actions } from './slice';
const { fetchUser } = actions;

export function* fetchUserSaga() {
  yield takeEvery(`${fetchUser}`, onFetchUser);
}
