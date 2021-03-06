import { call, put, select } from 'redux-saga/effects';
import * as debug from 'debug';

import { HoodMap } from '@youhood/map/types';
import apiFetch from '@youhood/fetch';

const log = debug('hood:effects');

import { afterSaveHood, replaceHoodId, selectHood } from '../actions';
import { getHoodPropsById } from '../selectors';
import { findHood, bindTooltip, removeLayerByHoodId } from '../utils';
import { SaveHoodAction } from '../types';

export function* onSaveHood({ hoodGeoJSON }: HoodMap, action: SaveHoodAction) {
  const hoodId = action.payload;
  const hood = yield call(findHood, hoodGeoJSON, hoodId);
  if (!hood) return;

  const props = yield select(getHoodPropsById, { id: hoodId });
  if (!props) {
    log(`Could not find props for ${hoodId}`);
    return;
  }
  const name = props.name;

  yield call(bindTooltip, hood, name);

  const hoodGeo = hood.toGeoJSON();
  hoodGeo.properties = props;

  const res = yield call(apiFetch, '/hood/save', {
    method: 'POST',
    body: JSON.stringify([hoodGeo]),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (res.status !== 200) {
    // TODO: add better error handling
    return;
  }

  const data = res.body;
  for (const hood of data.hoods) {
    if (hood.properties.id === hoodId) {
      continue;
    }

    removeLayerByHoodId(hoodGeoJSON, hoodId);
    yield put(
      replaceHoodId({ hoodId: hood.properties.id, prevHoodId: hoodId }),
    );
    yield put(selectHood(hood.properties.id));
  }
  yield put(afterSaveHood(data.hoods));
}
