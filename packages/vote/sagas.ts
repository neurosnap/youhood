import { takeEvery, put, call } from 'redux-saga/effects';

import { actions } from '@youhood/hood';
const { setHoodsOnPoint } = actions;

import { addVotes, removeVotes, vote, unvote } from './actions';
import { FetchVotesByHoodAction, VoteAction } from './types';

function* onFetchVotes(action: FetchVotesByHoodAction) {
  const hoodIds = action.payload;
  const resp = yield call(fetch, `/vote/${hoodIds.join(',')}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = yield resp.json();
  yield put(addVotes(data.votes));
}

export function* fetchVoteSaga() {
  yield takeEvery(`${setHoodsOnPoint}`, onFetchVotes);
}

function* onVote(action: VoteAction) {
  const { hoodId, userId } = action.payload;
  const resp = yield call(fetch, `/vote/${hoodId}/${userId}`, {
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
  yield takeEvery(`${vote}`, onVote);
}

function* onUnvote(action: VoteAction) {
  const { hoodId, userId } = action.payload;
  yield put(removeVotes({ [hoodId]: [userId] }));
  yield call(fetch, `/vote/${hoodId}/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function* unvoteSaga() {
  yield takeEvery(`${unvote}`, onUnvote);
}
