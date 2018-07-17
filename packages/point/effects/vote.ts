import { put, select, fork } from 'redux-saga/effects';

import { actions as voteActions } from '@youhood/vote';
const { vote, unvote } = voteActions;
import { VoteAction } from '@youhood/vote/types';

import { addPoints } from '../actions';
import pointMap from '../point-map';
import { findDuplicatePoint } from '../selectors';

import { submitPoints } from './submit';

export function* userVoted(action: VoteAction) {
  const { userId, hoodId } = action.payload;
  const point = {
    value: pointMap[`${vote}`],
    reason: `${vote}`,
    hoodId,
  };

  const foundDuplicatePoint = yield select(findDuplicatePoint, {
    hoodId,
    reason: point.reason,
  });
  if (foundDuplicatePoint >= 0) {
    return;
  }

  yield fork(submitPoints, { userId, hoodId, reason: point.reason });
  yield put(addPoints([point]));
}

export function* userUnvoted(action: VoteAction) {
  const { userId, hoodId } = action.payload;
  const point = {
    value: pointMap[`${unvote}`],
    reason: `${unvote}`,
    hoodId,
  };

  const foundDuplicatePoint = yield select(findDuplicatePoint, {
    hoodId,
    reason: point.reason,
  });
  if (foundDuplicatePoint >= 0) {
    return;
  }

  yield fork(submitPoints, { userId, hoodId, reason: point.reason });
  yield put(addPoints([point]));
}
