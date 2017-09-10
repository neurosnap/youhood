import { takeEvery, put } from 'redux-saga/effects';

import { actionTypes } from '../hood';
const { USER_ADD_HOODS } = actionTypes;
import { actionTypes as voteActionTypes } from '../vote';
const { VOTE } = voteActionTypes;

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

function* userVoted() {
  const point = {
    value: 1,
    reason: VOTE,
  };

  yield put(addPoints([point]));
}

export function* userVotedSaga() {
  yield takeEvery(VOTE, userVoted);
}
