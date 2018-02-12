import { takeEvery, put, call, select, fork } from 'redux-saga/effects';

import { UserId, HoodId, Hoods } from '../../types';
import { actionTypes, utils } from '../hood';
const { AFTER_SAVE_HOOD } = actionTypes;
const { getHoodId } = utils;
import { actionTypes as voteActionTypes } from '../vote';
const { VOTE, UNVOTE } = voteActionTypes;
import { VoteAction } from '../vote/action-creators';
import { selectors } from '../user';
const { getCurrentUserId } = selectors;

import { addPoints } from './action-creators';
import pointMap from './point-map';

interface SubmitPoints {
  userId: UserId;
  hoodId: HoodId;
  reason: string;
}

function* submitPoints({ userId, hoodId, reason }: SubmitPoints) {
  const result = yield call(fetch, `/point/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      hoodId,
      reason,
    }),
  });

  const body = yield result.json();
  console.log(body);
}

interface HoodsAction {
  type: string;
  payload: Hoods;
}

function* hoodCreated(action: HoodsAction) {
  const hoodId = getHoodId(action.payload[0]);
  const point = {
    value: pointMap[AFTER_SAVE_HOOD],
    reason: AFTER_SAVE_HOOD,
  };

  const userId = yield select(getCurrentUserId);
  yield fork(submitPoints, { userId, hoodId, reason: point.reason });
  yield put(addPoints([point]));
}

export function* hoodCreatedSaga() {
  yield takeEvery(AFTER_SAVE_HOOD, hoodCreated);
}

function* userVoted(action: VoteAction) {
  const { userId, hoodId } = action.payload;
  const point = {
    value: pointMap[VOTE],
    reason: VOTE,
  };

  yield fork(submitPoints, { userId, hoodId, reason: point.reason });
  yield put(addPoints([point]));
}

function* userUnvoted(action: VoteAction) {
  const { userId, hoodId } = action.payload;
  const point = {
    value: pointMap[UNVOTE],
    reason: UNVOTE,
  };

  yield fork(submitPoints, { userId, hoodId, reason: point.reason });
  yield put(addPoints([point]));
}

export function* userVotedSaga() {
  yield takeEvery(VOTE, userVoted);
}

export function* userUnvotedSaga() {
  yield takeEvery(UNVOTE, userUnvoted);
}
