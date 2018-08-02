import { takeEvery, put, call } from 'redux-saga/effects';

import apiFetch from '@youhood/fetch';
import { actions } from '@youhood/hood';
const { setHoodsOnPoint } = actions;

import { addVotes, removeVotes, vote, unvote } from './actions';
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

function* onVote(action: VoteAction) {
  const { hoodId, userId } = action.payload;
  const resp = yield call(apiFetch, `/vote/${hoodId}/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (resp.status !== 200) return;

  const data = resp.body;
  yield put(addVotes(data.votes));
}

export function* voteSaga() {
  yield takeEvery(`${vote}`, onVote);
}

function* onUnvote(action: VoteAction) {
  const { hoodId, userId } = action.payload;
  yield put(removeVotes({ [hoodId]: [userId] }));
  yield call(apiFetch, `/vote/${hoodId}/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function* unvoteSaga() {
  yield takeEvery(`${unvote}`, onUnvote);
}
