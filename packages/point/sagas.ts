import { takeEvery } from 'redux-saga/effects';

import { actions as authActions } from '@youhood/auth';
const { signedIn } = authActions;
import { actions } from '@youhood/hood';
const { afterSaveHood } = actions;
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

export function* afterHoodSavedSaga() {
  yield takeEvery(`${afterSaveHood}`, hoodCreated);
}

export function* userVotedSaga() {
  yield takeEvery(VOTE, userVoted);
}

export function* userUnvotedSaga() {
  yield takeEvery(UNVOTE, userUnvoted);
}

export function* signedInSaga() {
  yield takeEvery(`${signedIn}`, onSignedIn);
}

export function* fetchPointsByUserSaga() {
  yield takeEvery(FETCH_POINTS_BY_USER, onFetchPointsByUser);
}
