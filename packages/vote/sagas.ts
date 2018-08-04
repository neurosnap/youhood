import { takeEvery, put, call } from 'redux-saga/effects';

import apiFetch from '@youhood/fetch';
import { actions } from '@youhood/hood';
const { setHoodsOnPoint } = actions;

import { addVotes, upvote, downvote, unvote } from './actions';
import { FetchVotesByHoodAction, VoteAction } from './types';

function* onFetchVotes(action: FetchVotesByHoodAction) {
  const hoodIds = action.payload;
  const resp = yield call(apiFetch, `/vote/${hoodIds.join(',')}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = resp.body;
  yield put(addVotes(data.votes));
}

export function* fetchVoteSaga() {
  yield takeEvery(`${setHoodsOnPoint}`, onFetchVotes);
}

function* onVote(voteType: string, action: VoteAction) {
  const { hoodId, userId } = action.payload;
  const resp = yield call(apiFetch, `/vote/${hoodId}/${userId}/${voteType}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (resp.status !== 200) {
    return;
  }

  const data = resp.body;
  yield put(addVotes(data.votes));
}

export function* upvoteSaga() {
  yield takeEvery(`${upvote}`, onVote, 'upvote');
}

export function* downvoteSaga() {
  yield takeEvery(`${downvote}`, onVote, 'downvote');
}

function* onUnvote(action: VoteAction) {
  const { hoodId, userId } = action.payload;
  yield call(apiFetch, `/vote/${hoodId}/${userId}/unvote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function* unvoteSaga() {
  yield takeEvery(`${unvote}`, onUnvote);
}
