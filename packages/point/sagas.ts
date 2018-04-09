import { takeEvery, put, call, select, fork } from 'redux-saga/effects';

import { SignedInAction } from '@youhood/auth/types';
import { actionTypes as authActionTypes } from '@youhood/auth';
const { SIGNED_IN } = authActionTypes;
import { HoodId, Hoods } from '@youhood/hood/types';
import { actionTypes, utils } from '@youhood/hood';
const { AFTER_SAVE_HOOD } = actionTypes;
const { getHoodId } = utils;
import { actionTypes as voteActionTypes } from '@youhood/vote';
const { VOTE, UNVOTE } = voteActionTypes;
import { VoteAction } from '@youhood/vote/types';
import { selectors } from '@youhood/user';
const { getCurrentUserId } = selectors;
import { UserId } from '@youhood/user/types';

import { FETCH_POINTS_BY_USER } from './action-types';
import { 
  addPoints, 
  fetchPointsByUser, 
  resetPoints,
} from './action-creators';
import pointMap from './point-map';
import { FetchPointsByUserAction } from './types';
import { findDuplicatePoint } from './selectors';

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
    hoodId,
  };

  const foundDuplicatePoint = yield select(findDuplicatePoint, { hoodId, reason: point.reason });
  if (foundDuplicatePoint >= 0) {
    return;
  }

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
    hoodId,
  };

  const foundDuplicatePoint = yield select(findDuplicatePoint, { hoodId, reason: point.reason });
  if (foundDuplicatePoint >= 0) {
    return;
  }

  yield fork(submitPoints, { userId, hoodId, reason: point.reason });
  yield put(addPoints([point]));
}

function* userUnvoted(action: VoteAction) {
  const { userId, hoodId } = action.payload;
  const point = {
    value: pointMap[UNVOTE],
    reason: UNVOTE,
    hoodId,
  };

  const foundDuplicatePoint = yield select(findDuplicatePoint, { hoodId, reason: point.reason });
  if (foundDuplicatePoint >= 0) {
    return;
  }

  yield fork(submitPoints, { userId, hoodId, reason: point.reason });
  yield put(addPoints([point]));
}

export function* userVotedSaga() {
  yield takeEvery(VOTE, userVoted);
}

export function* userUnvotedSaga() {
  yield takeEvery(UNVOTE, userUnvoted);
}

function* onSignedIn(action: SignedInAction) {
  const userId = action.payload;
  yield put(fetchPointsByUser(userId));
}

export function* signedInSaga() {
  yield takeEvery(SIGNED_IN, onSignedIn);
}

interface PointResponsePayload {
  neighorhood_id: HoodId;
  created_at: string;
  reason: string;
}

function* onFetchPointsByUser(action: FetchPointsByUserAction) {
  const userId = action.payload;
  const resp = yield call(fetch, `/point/${userId}`);
  const body = yield resp.json();
  const points = body.points.map((point: PointResponsePayload) => ({
    value: pointMap[point.reason],
    reason: point.reason,
  }));

  yield put(resetPoints());
  yield put(addPoints(points));
}

export function* fetchPointsByUserSaga() {
  yield takeEvery(FETCH_POINTS_BY_USER, onFetchPointsByUser);
}
