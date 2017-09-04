import { takeEvery } from 'redux-saga';
import { put, call, select } from 'redux-saga/effects';

import { PolygonLeaflet, PolygonHood, HoodMap, HoodId } from '../../types';

import { actionCreators } from '../menu';

import {
  DESELECT_HOOD,
  SELECT_HOOD,
  TOGGLE_HOOD_SELECTED,
  HOVER_HOOD,
  EDIT_HOOD,
  SAVE_HOOD,
} from './action-types';
import {
  HoodSelectedAction,
  ToggleHoodSelectedAction,
  selectHood,
  deselectHood,
  HoverHoodAction,
  EditHoodAction,
  SaveHoodAction,
  addHoods,
} from './action-creators';
import styleFn from './style';
import { getHoodIdSelected, getHoodById } from './selectors';
import { getHoodId, getHoodProperties } from './utils';

const { showMenu, hideMenu } = actionCreators;

export function* deselectHoodSaga(hoodMap: HoodMap) {
  yield takeEvery(DESELECT_HOOD, onDeselectHood, hoodMap);
}

function onDeselectHood({ hoodGeoJSON }: HoodMap) {
  hoodGeoJSON.eachLayer((hood: PolygonLeaflet) => {
    hood.setStyle(styleFn({ selected: false }));
  });
}

export function* selectHoodSaga(hoodMap: HoodMap) {
  yield takeEvery(SELECT_HOOD, onSelectHood, hoodMap);
}

function findHood(layers: L.GeoJSON, hoodId: HoodId): PolygonHood {
  let hood = null;

  layers.eachLayer((layer) => {
    if (getHoodId(layer) === hoodId) {
      hood = layer;
    }
  });

  return hood;
}

interface ApplyStyle {
  hoodMap: HoodMap;
  hoodId: HoodId;
  style: Object;
}

function applyStyle({ hoodMap, hoodId, style }: ApplyStyle) {
  const hood = <PolygonLeaflet>findHood(hoodMap.hoodGeoJSON, hoodId);
  if (!hood) return;

  hood.setStyle(styleFn(style));
  hood.bringToFront();
}

function* onSelectHood(hoodMap: HoodMap, action: HoodSelectedAction) {
  const hoodId = action.payload;
  const style = { selected: true };
  yield call(onDeselectHood, hoodMap);
  yield call(applyStyle, { hoodMap, hoodId, style });
  yield put(showMenu('overlay'));
}

function* onHoverHood(hoodMap: HoodMap, action: HoverHoodAction) {
  const { hoodId, hover } = action.payload;
  const style = { hover };
  yield call(applyStyle, { hoodMap, hoodId, style });
}

export function* hoverHoodSaga(hoodMap: HoodMap) {
  yield takeEvery(HOVER_HOOD, onHoverHood, hoodMap);
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

function onEditHood({ hoodGeoJSON }: HoodMap, action: EditHoodAction) {
  const { hoodId, edit } = action.payload;
  const hood = <any>findHood(hoodGeoJSON, hoodId);
  if (!hood) return;

  if (edit) {
    hood.editing.enable();
  } else {
    hood.editing.disable();
  }
}

export function* editHoodSaga(hoodMap: HoodMap) {
  yield takeEvery(EDIT_HOOD, onEditHood, hoodMap);
}

function* onSaveHood({ hoodGeoJSON }: HoodMap, action: SaveHoodAction) {
  const hoodId = action.payload;
  const hood = <PolygonLeaflet>findHood(hoodGeoJSON, hoodId);
  if (!hood) return;

  const hoodGeo = hood.toGeoJSON();
  const curHood = yield select(getHoodById, { id: hoodId });
  const hoodProperties = getHoodProperties(curHood);
  hoodGeo.properties = hoodProperties;
  yield put(addHoods([hoodGeo]));
}

export function* saveHoodSaga(hoodMap: HoodMap) {
  yield takeEvery(SAVE_HOOD, onSaveHood, hoodMap);
}
