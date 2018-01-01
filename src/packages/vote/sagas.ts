import { takeEvery, put } from 'redux-saga/effects';

import { actionTypes } from '../hood';
const { SET_HOODS_ON_POINT } = actionTypes;

import {
  FetchVotesByHoodAction,
  addVotes,
  removeVotes,
  VoteAction,
} from './action-creators';
import { VOTE, UNVOTE } from './action-types';

function* onFetchVotes(action: FetchVotesByHoodAction) {
  const hoodIds = action.payload;
  const resp = yield fetch(`/votes/${hoodIds.join(',')}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = yield resp.json();
  yield put(addVotes(data.votes));
}

export function* fetchVoteSaga() {
  yield takeEvery(SET_HOODS_ON_POINT, onFetchVotes);
}

function* onVote(action: VoteAction) {
  const { hoodId, userId } = action.payload;
  const resp = yield fetch(`/vote/${hoodId}/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (resp.status !== 200) return;

  const data = yield resp.json();
  yield put(addVotes(data.votes));
}

export function* voteSaga() {
  yield takeEvery(VOTE, onVote);
}

function* onUnvote(action: VoteAction) {
  const { hoodId, userId } = action.payload;
  yield put(removeVotes({ [hoodId]: [userId] }));
  yield fetch(`/vote/${hoodId}/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function* unvoteSaga() {
  yield takeEvery(UNVOTE, onUnvote);
}
