import { takeEvery } from 'redux-saga';
import { put, call, all, select } from 'redux-saga/effects';

import { Hood } from '../../types';

import { actionCreators } from '../menu';

import {
  DESELECT_HOOD,
  SELECT_HOOD,
  TOGGLE_HOOD_SELECTED,
} from './action-types';
import {
  HoodSelectedAction,
} from './action-creators';
import styleFn from './style';
import { getHoods } from './selectors';

const { showMenu } = actionCreators;

export function* deselectHoodSaga() {
  yield takeEvery(DESELECT_HOOD, deselectHood);
}

function* deselectHood() {
  const hoods = yield select(getHoods);
  hoods.forEach((hood: Hood) => {
    hood.setStyle(styleFn({ selected: false }));
  });
}

export function* selectHoodSaga() {
  yield takeEvery(SELECT_HOOD, selectHood);
}

function* selectHood(action: HoodSelectedAction) {
  const hood = action.payload;
  yield call(deselectHood);
  hood.setStyle(styleFn({ selected: true }));
  hood.bringToFront();
  yield put(showMenu('overlay'));
}

export function* toggleHoodSelectedSaga() {
  yield takeEvery(TOGGLE_HOOD_SELECTED, toggleHoodSelected);
}

function* toggleHoodSelected(hood: Hood) {
  yield all([
    call(deselectHood, hood),
    call(selectHood, { payload: hood }),
  ]);
}
