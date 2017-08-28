import { takeEvery } from 'redux-saga';
import { put, call, all, select } from 'redux-saga/effects';

import { Hood, HoodMap, HoodId } from '../../types';

import { actionCreators } from '../menu';

import {
  DESELECT_HOOD,
  SELECT_HOOD,
  TOGGLE_HOOD_SELECTED,
} from './action-types';
import {
  HoodSelectedAction,
  ToggleHoodSelectedAction,
  selectHood,
  deselectHood,
} from './action-creators';
import styleFn from './style';
import { getHoods, getHoodIdSelected } from './selectors';
import { getHoodId } from './utils';

const { showMenu, hideMenu } = actionCreators;

export function* deselectHoodSaga(hoodMap: HoodMap) {
  yield takeEvery(DESELECT_HOOD, onDeselectHood, hoodMap);
}

function onDeselectHood({ hoodGeoJSON }: HoodMap) {
  hoodGeoJSON.eachLayer((hood: L.Polygon) => {
    console.log(hood);
    hood.setStyle(styleFn({ selected: false }));
  });
}

export function* selectHoodSaga(hoodMap: HoodMap) {
  yield takeEvery(SELECT_HOOD, onSelectHood, hoodMap);
}

function findHood(layers: L.GeoJSON, hoodId: HoodId): Hood {
  let hood = null;

  layers.eachLayer((layer: L.Polygon) => {
    if (getHoodId(layer) === hoodId) {
      hood = layer;
    }
  });

  return hood;
}

function* onSelectHood(hoodMap: HoodMap, action: HoodSelectedAction) {
  yield call(deselectHood, hoodMap);
  const hoodId = action.payload;
  const hood = findHood(hoodMap.hoodGeoJSON, hoodId);
  if (!hood) return;

  hood.setStyle(styleFn({ selected: true }));
  hood.bringToFront();
  yield put(showMenu('overlay'));
}

export function* toggleHoodSelectedSaga(hoodMap: HoodMap) {
  yield takeEvery(TOGGLE_HOOD_SELECTED, toggleHoodSelected, hoodMap);
}

function* toggleHoodSelected(hoodMap: HoodMap, action: ToggleHoodSelectedAction) {
  const hoodId = action.payload;
  const hoodIdSelected = yield select(getHoodIdSelected);

  if (hoodId === hoodIdSelected) {
    yield put(deselectHood());
    yield put(hideMenu('overlay'));
    return;
  }

  yield put(deselectHood());
  yield put(selectHood(hoodId));
}
