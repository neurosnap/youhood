import * as L from 'leaflet';
import 'leaflet-draw';
import { put, call, select, takeEvery } from 'redux-saga/effects';

import { HoodMap } from '@youhood/map/types';
import { actionCreators } from '@youhood/menu';
const { showMenu, hideMenu } = actionCreators;
import { actionCreators as userActionCreators } from '@youhood/user';
const { addUsers } = userActionCreators;
import { User, RawUser } from '@youhood/user/types';

import {
  DESELECT_HOOD,
  SELECT_HOOD,
  TOGGLE_HOOD_SELECTED,
  HOVER_HOOD,
  EDIT_HOOD,
  SAVE_HOOD,
  DRAW_HOOD,
  ADD_HOODS,
} from './action-types';
import {
  selectHood,
  deselectHood,
} from './action-creators';
import styleFn from './style';
import { getHoodIdSelected, getHoodSelected } from './selectors';
import { findHood, getHoodProperties } from './utils';
import { onSaveHood } from './effects';
import {
  HoodSelectedAction,
  ToggleHoodSelectedAction,
  HoverHoodAction,
  EditHoodAction,
  PolygonLeaflet, 
  HoodId,
  Hood,
  AddHoodsAction,
} from './types';

export function* addHoodsSaga(hoodMap: HoodMap) {
  yield takeEvery(ADD_HOODS, onAddHoods, hoodMap);
}

function onAddHoods({ hoodGeoJSON }: HoodMap, action: AddHoodsAction) {
  const hoods = action.payload;
  const hoodIds = hoods.map((hood: Hood) => {
    const props = getHoodProperties(hood);
    return props.id;
  }); 

  hoodGeoJSON.eachLayer((hood: PolygonLeaflet) => {
    const props = getHoodProperties(hood);
    const name = props.name;
    const hoodId = props.id;
    if (hoodIds.indexOf(hoodId) === -1) {
      return;
    }

    hood.setStyle(styleFn());

    hood.bindTooltip(name, { 
      sticky: true, 
      offset: [25, 0], 
      direction: 'right',
    });

    hood.on('mouseover', () => {
      hood.setStyle(styleFn({ hover: true }));
    });

    hood.on('mouseout', () => {
      hood.setStyle(styleFn());
    });
  });
}

export function* drawHoodSaga(hoodMap: HoodMap) {
  yield takeEvery(DRAW_HOOD, onDrawHood, hoodMap);
}

function onDrawHood({ map, drawControl }: HoodMap) {
  console.log(drawControl);
  new L.Draw.Polygon(map).enable();
}

export function* saveHoodSaga(hoodMap: HoodMap) {
  yield takeEvery(SAVE_HOOD, onSaveHood, hoodMap);
}

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

function  transformUser(rawUser: RawUser): User {
  if (!rawUser) return null;
  return {
    id: rawUser.id,
    email: rawUser.email,
    createdAt: rawUser.created_at,
    isTmp: rawUser.is_tmp,
  };
}

function* onSelectHood(hoodMap: HoodMap, action: HoodSelectedAction) {
  const hoodId = action.payload;
  const style = { selected: true };
  yield call(onDeselectHood, hoodMap);
  yield call(applyStyle, { hoodMap, hoodId, style });
  yield put(showMenu('overlay'));

  const hood = yield select(getHoodSelected);
  const userId = getHoodProperties(hood).userId;
  const userResp = yield call(fetch, `/user/${userId}`);
  const rawUser = yield userResp.json();
  const user = transformUser(rawUser.user);
  if (!user) return;
  yield put(addUsers([user]));
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
