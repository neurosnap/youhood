import * as L from 'leaflet';
import 'leaflet-draw';
import { call, race, put, take } from 'redux-saga/effects';

import { HoodMap } from '@youhood/map/types';

import { setEdit, hoodCreated, cancelDrawHood } from '../actions';

export function createPolygon({ map }: HoodMap) {
  return new L.Draw.Polygon(map);
}

export function* onDrawHood(hoodMap: HoodMap) {
  yield put(setEdit(true));
  const poly = yield call(createPolygon, hoodMap);
  poly.enable();

  const winner = yield race({
    cancel: take(`${cancelDrawHood}`),
    create: take(`${hoodCreated}`),
  });

  if (winner.cancel) {
    poly.disable();
    yield put(setEdit(false));
  }
}
