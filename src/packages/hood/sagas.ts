import { takeEvery } from 'redux-saga';
import { put, call, all, select } from 'redux-saga/effects';

import { Hood, HoodMap } from '../../types';

import { actionCreators } from '../menu';

import {
  DESELECT_HOOD,
  SELECT_HOOD,
  TOGGLE_HOOD_SELECTED,
} from './action-types';
import {
  HoodSelectedAction,
  ToggleHoodSelectedAction,
} from './action-creators';
import styleFn from './style';
import { getHoods } from './selectors';

const { showMenu } = actionCreators;

export function* deselectHoodSaga(hoodMap: HoodMap) {
  yield takeEvery(DESELECT_HOOD, deselectHood, hoodMap);
}

function* deselectHood({ hoodGeoJSON }: HoodMap) {
  const hoods = yield select(getHoods);
  hoodGeoJSON.eachLayer((hood: L.Polygon) => {
    console.log(hood);
    hood.setStyle(styleFn({ selected: false }));
  });
}

export function* selectHoodSaga(hoodMap: HoodMap) {
  yield takeEvery(SELECT_HOOD, selectHood, hoodMap);
}

function* selectHood(hoodMap: HoodMap, action: HoodSelectedAction) {
  const hoodId = action.payload;
  yield call(deselectHood, hoodMap);
  const hood: L.Polygon = hoodMap.hoodGeoJSON.getLayer(hoodId);
  hood.setStyle(styleFn({ selected: true }));
  hood.bringToFront();
  yield put(showMenu('overlay'));
}

export function* toggleHoodSelectedSaga(hoodMap: HoodMap) {
  yield takeEvery(TOGGLE_HOOD_SELECTED, toggleHoodSelected, hoodMap);
}

function* toggleHoodSelected(hoodMap: HoodMap, action: ToggleHoodSelectedAction) {
  const hoodId = action.payload;
  yield all([
    call(deselectHood, hoodMap),
    call(selectHood, hoodMap, { payload: hoodId }),
  ]);
}
