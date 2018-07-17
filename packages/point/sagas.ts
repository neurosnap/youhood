import { takeEvery } from 'redux-saga/effects';

import { actions as authActions } from '@youhood/auth';
const { signedIn } = authActions;
import { actions } from '@youhood/hood';
const { afterSaveHood } = actions;
import { actions as voteActions } from '@youhood/vote';
const { vote, unvote } = voteActions;

import { fetchPointsByUser } from './actions';
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
  yield takeEvery(`${vote}`, userVoted);
}

export function* userUnvotedSaga() {
  yield takeEvery(`${unvote}`, userUnvoted);
}

export function* signedInSaga() {
  yield takeEvery(`${signedIn}`, onSignedIn);
}

export function* fetchPointsByUserSaga() {
  yield takeEvery(`${fetchPointsByUser}`, onFetchPointsByUser);
}
