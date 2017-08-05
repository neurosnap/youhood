import { takeEvery } from 'redux-saga';
import { put, call, all, select } from 'redux-saga/effects';

import { Polygon } from '../../types';

import { actionCreators } from '../menu';

import {
  DESELECT_HOOD,
  SELECT_HOOD,
  TOGGLE_HOOD_SELECTED,
} from './action-types';
import styleFn from './style';
import { getHoods } from './selectors';

const { showMenu } = actionCreators;

export function* deselectHoodSaga() {
  yield takeEvery(DESELECT_HOOD, deselectHood);
}

function* deselectHood() {
  const hoods = yield select(getHoods);
  hoods.forEach((hood: Polygon) => {
    hood.setStyle(styleFn({ selected: false }));
  });
}

export function* selectHoodSaga() {
  yield takeEvery(SELECT_HOOD, selectHood);
}

function* selectHood(action) {
  const hood = action.payload;
  yield call(deselectHood);
  hood.setStyle(styleFn({ selected: true }));
  hood.bringToFront();
  yield put(showMenu('overlay'));
}

export function* toggleHoodSelectedSaga() {
  yield takeEvery(TOGGLE_HOOD_SELECTED, toggleHoodSelected);
}

function* toggleHoodSelected(hood: Polygon) {
  yield all([
    call(deselectHood, hood),
    call(selectHood, hood),
  ]);
}
