import * as L from 'leaflet';
import 'leaflet-draw';
import { call, race, put, take } from 'redux-saga/effects';

import { HoodMap } from '@youhood/map/types';

import {
  HOOD_CREATED,
  CANCEL_DRAW_HOOD,
} from '../action-types';
import {
  setEdit,
} from '../action-creators';

export function createPolygon({ map }: HoodMap) {
  return new L.Draw.Polygon(map);
}

export function* onDrawHood(hoodMap: HoodMap) {
  yield put(setEdit(true));
  const poly = yield call(createPolygon, hoodMap);
  poly.enable();

  const winner = yield race({
    cancel: take(CANCEL_DRAW_HOOD),
    create: take(HOOD_CREATED),
  });

  if (winner.cancel) {
    poly.disable();
    yield put(setEdit(false));
  }
}
