import { takeEvery, put } from 'redux-saga/effects';

import { actionTypes } from '../hood';
const { USER_ADD_HOODS } = actionTypes;

import { addPoints } from './action-creators';

function* hoodCreated() {
  const point = {
    value: 10,
    reason: USER_ADD_HOODS,
  };

  yield put(addPoints([point]));
}

export function* hoodCreatedSaga() {
  yield takeEvery(USER_ADD_HOODS, hoodCreated);
}
