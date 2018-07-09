import { takeEvery, spawn, take } from 'redux-saga/effects';

import { HoodMap } from '@youhood/map/types';

import {
  deselectHood,
  selectHood,
  toggleHoodSelected,
  hoverHood,
  editHood,
  saveHood,
  drawHood,
  hoodCreated,
  hideHoods,
  showHoods,
  hideAllHoods,
  showAllHoods,
} from './actions';
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
  toggleHoodSelected as onToggleHoodSelected,
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
  yield takeEvery(`${showAllHoods}`, onShowAllHoods, hoodMap);
}

export function* hideAllHoodsSaga(hoodMap: HoodMap) {
  yield takeEvery(`${hideAllHoods}`, onHideAllHoods, hoodMap);
}

export function* showHoodsSaga(hoodMap: HoodMap) {
  yield takeEvery(`${showHoods}`, onShowHoods, hoodMap);
}

export function* hideHoodsSaga(hoodMap: HoodMap) {
  yield takeEvery(`${hideHoods}`, onHideHoods, hoodMap);
}

export function* drawHoodSaga(hoodMap: HoodMap) {
  yield takeEvery(`${drawHood}`, onDrawHood, hoodMap);
}

export function* saveHoodSaga(hoodMap: HoodMap) {
  yield takeEvery(`${saveHood}`, onSaveHood, hoodMap);
}

export function* deselectHoodSaga(hoodMap: HoodMap) {
  yield takeEvery(`${deselectHood}`, onDeselectHood, hoodMap);
}

export function* selectHoodSaga(hoodMap: HoodMap) {
  yield takeEvery(`${selectHood}`, onSelectHood, hoodMap);
}

export function* hoverHoodSaga(hoodMap: HoodMap) {
  yield takeEvery(`${hoverHood}`, onHoverHood, hoodMap);
}

export function* toggleHoodSelectedSaga(hoodMap: HoodMap) {
  yield takeEvery(`${toggleHoodSelected}`, onToggleHoodSelected, hoodMap);
}

export function* editHoodSaga(hoodMap: HoodMap) {
  yield takeEvery(`${editHood}`, onEditHood, hoodMap);
}

export function* hoodCreatedSaga(hoodMap: HoodMap) {
  yield takeEvery(`${hoodCreated}`, onHoodCreated, hoodMap);
}
