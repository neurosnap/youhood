import { takeEvery, spawn, take } from 'redux-saga/effects';

import { HoodMap } from '@youhood/map/types';

import {
  DESELECT_HOOD,
  SELECT_HOOD,
  TOGGLE_HOOD_SELECTED,
  HOVER_HOOD,
  EDIT_HOOD,
  SAVE_HOOD,
  DRAW_HOOD,
  HOOD_CREATED,
  HIDE_HOODS,
  SHOW_HOODS,
  HIDE_ALL_HOODS,
  SHOW_ALL_HOODS,
} from './action-types';
import {
  onHoverHood,
  onShowAllHoods,
  onHideAllHoods,
  onShowHoods,
  onHideHoods,
  onSaveHood,
  onDrawHood,
  onDeselectHood,
  onSelectHood,
  onEditHood,
  onHoodCreated,
  toggleHoodSelected,
  createLayerChannel,
  onLayerEvent,
} from './effects';

export function* layerSaga({ hoodGeoJSON }: HoodMap) {
  const channel = createLayerChannel(hoodGeoJSON);

  while (true) {
    const event = yield take(channel);
    yield spawn(onLayerEvent, event);
  }
}

export function* showAllHoodsSaga(hoodMap: HoodMap) {
  yield takeEvery(SHOW_ALL_HOODS, onShowAllHoods, hoodMap);
}

export function* hideAllHoodsSaga(hoodMap: HoodMap) {
  yield takeEvery(HIDE_ALL_HOODS, onHideAllHoods, hoodMap);
}

export function* showHoodsSaga(hoodMap: HoodMap) {
  yield takeEvery(SHOW_HOODS, onShowHoods, hoodMap);
}

export function* hideHoodsSaga(hoodMap: HoodMap) {
  yield takeEvery(HIDE_HOODS, onHideHoods, hoodMap);
}

export function* drawHoodSaga(hoodMap: HoodMap) {
  yield takeEvery(DRAW_HOOD, onDrawHood, hoodMap);
}

export function* saveHoodSaga(hoodMap: HoodMap) {
  yield takeEvery(SAVE_HOOD, onSaveHood, hoodMap);
}

export function* deselectHoodSaga(hoodMap: HoodMap) {
  yield takeEvery(DESELECT_HOOD, onDeselectHood, hoodMap);
}

export function* selectHoodSaga(hoodMap: HoodMap) {
  yield takeEvery(SELECT_HOOD, onSelectHood, hoodMap);
}

export function* hoverHoodSaga(hoodMap: HoodMap) {
  yield takeEvery(HOVER_HOOD, onHoverHood, hoodMap);
}

export function* toggleHoodSelectedSaga(hoodMap: HoodMap) {
  yield takeEvery(TOGGLE_HOOD_SELECTED, toggleHoodSelected, hoodMap);
}

export function* editHoodSaga(hoodMap: HoodMap) {
  yield takeEvery(EDIT_HOOD, onEditHood, hoodMap);
}

export function* hoodCreatedSaga(hoodMap: HoodMap) {
  yield takeEvery(HOOD_CREATED, onHoodCreated, hoodMap);
}
