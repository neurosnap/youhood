import { put } from 'redux-saga/effects';

import { resetPoints } from '../actions';

export function* onSignedOut() {
  yield put(resetPoints());
}
