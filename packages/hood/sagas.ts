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
  addHoodsAndProps,
  showOnlyWinnerHoods,
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
  onAddHoodsAndProps,
  onShowOnlyWinnerHoods,
} from './effects';

export function* layerSaga(hoodMap: HoodMap) {
  if (!hoodMap) {
    return;
  }

  const channel = createLayerChannel(hoodMap.hoodGeoJSON);

  while (true) {
    const event = yield take(channel);
    yield spawn(onLayerEvent, event);
  }
}

export function* showOnlyWinnerHoodsSaga(hoodMap: HoodMap) {
  yield takeEvery(`${showOnlyWinnerHoods}`, onShowOnlyWinnerHoods, hoodMap);
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

export function* onAddHoodsAndPropsSaga(hoodMap: HoodMap) {
  yield takeEvery(`${addHoodsAndProps}`, onAddHoodsAndProps, hoodMap);
}
