import { call, put, select } from 'redux-saga/effects';

import {
  actions as voteActions,
  selectors as voteSelectors,
} from '@youhood/vote';
const { upvote } = voteActions;
const { didUserVoteOnHood } = voteSelectors;
import { UnvoteAction, VoteAction } from '@youhood/vote/types';

import { addPoints, removePoints } from '../actions';
import pointMap from '../point-map';
import { findDuplicatePoint } from '../selectors';

export function* userUpVoted(action: VoteAction) {
  const { hoodId } = action.payload;
  const point = {
    value: pointMap[`${upvote}`],
    reason: `${upvote}`,
    hoodId,
  };

  const foundDuplicatePoint = yield select(findDuplicatePoint, {
    hoodId,
    reason: point.reason,
  });
  if (foundDuplicatePoint >= 0) {
    return;
  }

  yield put(addPoints([point]));
}

export function* userDownVoted(action: VoteAction) {
  const { userId, hoodId } = action.payload;
  const userVoted = yield select(didUserVoteOnHood, { userId, hoodId });
  if (userVoted) {
    yield call(userUnvoted, action);
  }
}

export function* userUnvoted(action: UnvoteAction) {
  const { hoodId, voteType } = action.payload;

  if (voteType === 'downvote') {
    return;
  }

  yield put(removePoints(hoodId));
}
