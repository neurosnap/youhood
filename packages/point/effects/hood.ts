import { put, select, fork } from 'redux-saga/effects';

import { Hoods } from '@youhood/hood/types';
import { actionTypes, utils } from '@youhood/hood';
const { AFTER_SAVE_HOOD } = actionTypes;
const { getHoodId } = utils;
import { selectors } from '@youhood/user';
const { getCurrentUserId } = selectors;

import { addPoints } from '../action-creators';
import pointMap from '../point-map';
import { findDuplicatePoint } from '../selectors';

import { submitPoints } from './submit';

interface HoodsAction {
  type: string;
  payload: Hoods;
}

export function* hoodCreated(action: HoodsAction) {
  const hoodId = getHoodId(action.payload[0]);
  const point = {
    value: pointMap[AFTER_SAVE_HOOD],
    reason: AFTER_SAVE_HOOD,
    hoodId,
  };

  const findOpts = { hoodId, reason: point.reason };
  const foundDuplicatePoint = yield select(findDuplicatePoint, findOpts);
  if (foundDuplicatePoint >= 0) {
    return;
  }

  const userId = yield select(getCurrentUserId);
  yield fork(submitPoints, { userId, hoodId, reason: point.reason });
  yield put(addPoints([point]));
}
