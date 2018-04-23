import { takeEvery } from 'redux-saga/effects';

import { actionTypes as authActionTypes } from '@youhood/auth';
const { SIGNED_IN } = authActionTypes;
import { actionTypes } from '@youhood/hood';
const { AFTER_SAVE_HOOD } = actionTypes;
import { actionTypes as voteActionTypes } from '@youhood/vote';
const { VOTE, UNVOTE } = voteActionTypes;

import { FETCH_POINTS_BY_USER } from './action-types';
import {
  hoodCreated,
  userVoted,
  userUnvoted,
  onSignedIn,
  onFetchPointsByUser,
} from './effects';

export function* hoodCreatedSaga() {
  yield takeEvery(AFTER_SAVE_HOOD, hoodCreated);
}

export function* userVotedSaga() {
  yield takeEvery(VOTE, userVoted);
}

export function* userUnvotedSaga() {
  yield takeEvery(UNVOTE, userUnvoted);
}

export function* signedInSaga() {
  yield takeEvery(SIGNED_IN, onSignedIn);
}

export function* fetchPointsByUserSaga() {
  yield takeEvery(FETCH_POINTS_BY_USER, onFetchPointsByUser);
}
