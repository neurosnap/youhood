import { put, select } from 'redux-saga/effects';

import { PolygonLeaflet, HoodMap } from '../../types';

import {
  SaveHoodAction,
  addHoods,
  afterSaveHood,
} from './action-creators';
import { getHoodById } from './selectors';
import { getHoodProperties, findHood } from './utils';

export function* onSaveHood(
  { hoodGeoJSON }: HoodMap,
  action: SaveHoodAction,
) {
  const hoodId = action.payload;
  const hood = <PolygonLeaflet>findHood(hoodGeoJSON, hoodId);
  if (!hood) return;

  const hoodGeo = hood.toGeoJSON();
  const curHood = yield select(getHoodById, { id: hoodId });
  const hoodProperties = getHoodProperties(curHood);

  hoodGeo.properties = hoodProperties;
  yield put(addHoods([hoodGeo]));

  const res = yield fetch('/hood/save', {
    method: 'POST',
    body: JSON.stringify([hoodGeo]),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = yield res.json();
  console.log(data);
  yield put(afterSaveHood(data.hoods));
}
