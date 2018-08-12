import { put, select } from 'redux-saga/effects';

import { Hoods } from '@youhood/hood/types';
import { actions, utils } from '@youhood/hood';
const { afterSaveHood } = actions;
const { getHoodId } = utils;

import { addPoints } from '../actions';
import pointMap from '../point-map';
import { findDuplicatePoint } from '../selectors';

interface HoodsAction {
  type: string;
  payload: Hoods;
}

export function* hoodCreated(action: HoodsAction) {
  const hoodId = getHoodId(action.payload[0]);
  const point = {
    value: pointMap[`${afterSaveHood}`],
    reason: `${afterSaveHood}`,
    hoodId,
  };

  const findOpts = { hoodId, reason: point.reason };
  const foundDuplicatePoint = yield select(findDuplicatePoint, findOpts);
  if (foundDuplicatePoint >= 0) {
    return;
  }

  yield put(addPoints([point]));
}
