import { takeEvery } from 'redux-saga';
import { put, call, all } from 'redux-saga/effects';

import {
  DESELECT_HOOD,
  SELECT_HOOD,
  TOGGLE_HOOD_SELECTED,
} from './action-types';
import styleFn from './style';

import { showMenu } from '../menu';

export function* deselectHoodSaga() {
  yield takeEvery(DESELECT_HOOD, deselectHood);
}

function deselectHood(action) {
  const hood = action.payload;
  hood.setStyle(styleFn({ selected: false }));
}

export function* selectHoodSaga() {
  yield takeEvery(SELECT_HOOD, selectHood);
}

function* selectHood(action) {
  const hood = action.payload;
  hood.setStyle(styleFn({ selected: true }));
  hood.bringToFront();
  yield put(showMenu('overlay'));
}

export function* toggleHoodSelectedSaga() {
  yield takeEvery(TOGGLE_HOOD_SELECTED, toggleHoodSelected);
}

function* toggleHoodSelected(hood) {
  yield all([
    call(deselectHood, hood),
    call(selectHood, hood),
  ]);
}
