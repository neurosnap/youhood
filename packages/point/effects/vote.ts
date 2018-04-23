import { put, select, fork } from 'redux-saga/effects';

import { actionTypes as voteActionTypes } from '@youhood/vote';
const { VOTE, UNVOTE } = voteActionTypes;
import { VoteAction } from '@youhood/vote/types';

import { addPoints } from '../action-creators';
import pointMap from '../point-map';
import { findDuplicatePoint } from '../selectors';

import { submitPoints } from './submit';

export function* userVoted(action: VoteAction) {
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

export function* userUnvoted(action: VoteAction) {
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
