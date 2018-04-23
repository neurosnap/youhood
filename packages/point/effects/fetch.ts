import { put, call } from 'redux-saga/effects';

import { HoodId } from '@youhood/hood/types';
import apiFetch from '@youhood/fetch';

import {
  addPoints,
  resetPoints,
} from '../action-creators';
import pointMap from '../point-map';
import { FetchPointsByUserAction } from '../types';

interface PointResponsePayload {
  neighborhood_id: HoodId;
  created_at: string;
  reason: string;
}

export function* onFetchPointsByUser(action: FetchPointsByUserAction) {
  const userId = action.payload;
  const resp = yield call(apiFetch, `/point/${userId}`);
  const body = resp.body;
  const points = body.points.map((point: PointResponsePayload) => ({
    value: pointMap[point.reason],
    reason: point.reason,
    hoodId: point.neighborhood_id,
  }));

  yield put(resetPoints());
  yield put(addPoints(points));
}
