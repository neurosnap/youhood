import * as L from 'leaflet';
import 'leaflet-draw';
import { put, call, select, takeEvery, take, spawn } from 'redux-saga/effects';

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
  HIDE_HOODS,
  SHOW_HOODS,
} from './action-types';
import {
  selectHood,
  deselectHood,
  addHoodProps,
} from './action-creators';
import styleFn from './style';
import { getHoodIdSelected, getHoodSelected, getHoodsByIds, getHoodPropsByIds } from './selectors';
import { findHood, getHoodProperties, getHoodId, getHoodPropsMapFromHoods } from './utils';
import { onSaveHood } from './effects';
import {
  HoodSelectedAction,
  ToggleHoodSelectedAction,
  HoverHoodAction,
  EditHoodAction,
  PolygonLeaflet, 
  HoodId,
  HoodIds,
} from './types';
import { eventChannel } from 'redux-saga';

const HOOD_MOUSE_OVER = 'mouseover';
const HOOD_MOUSE_OUT = 'mouseout';
const LAYER_ADD = 'layeradd';

const createLayerChannel = (layerGroup: L.GeoJSON) => eventChannel((emit) => {
  const onLayerAdd = (layer: L.LeafletEvent) => {
    emit({ type: LAYER_ADD, payload: layer });
  };

  layerGroup.on('layeradd', onLayerAdd);

  return () => {
    layerGroup.off('layeradd', onLayerAdd);
  };
});

export function* layerSaga({ hoodGeoJSON }: HoodMap) {
  const channel = createLayerChannel(hoodGeoJSON);

  while (true) {
    const event = yield take(channel);
    const { type, payload } = event;
    const layer = payload;

    switch (type) {
      case LAYER_ADD: {
        console.log(layer);
        yield spawn(prepareHoods, [layer.layer]);
      }
      default:
        break;
    }
  }
}

const createHoodChannel = (hood: PolygonLeaflet) => eventChannel((emit) => {
  const props = getHoodProperties(hood);
  const name = props.name;

  const onMouseOver = () => {
    emit({ type: HOOD_MOUSE_OVER });
  };

  const onMouseOut = () => {
    emit({ type: HOOD_MOUSE_OUT });
  };

  hood.on('mouseover', onMouseOver);
  hood.on('mouseout', onMouseOut);
  hood.bindTooltip(name, { 
    sticky: true, 
    offset: [25, 0], 
    direction: 'right',
  });

  return () => {
    hood.off(HOOD_MOUSE_OVER, onMouseOver);
    hood.off(HOOD_MOUSE_OUT, onMouseOut);
    hood.unbindTooltip();
  };
});

function* startHoodEvents(hood: PolygonLeaflet) {
  const channel = yield call(createHoodChannel, hood);
  const hoodId = getHoodId(hood);

  while (true) {
    const event = yield take(channel);
    const { type } = event;
    const hoodIdSelected = yield select(getHoodIdSelected);
    if (hoodIdSelected === hoodId) {
      continue;
    }
    
    switch (type) {
      case HOOD_MOUSE_OVER:
        hood.setStyle(styleFn({ hover: true }));
        break;
      case HOOD_MOUSE_OUT:
        hood.setStyle(styleFn());
        break;
      default:
        break;
    }
  }
}

interface HoodIdsAction {
  type: string;
  payload: HoodIds;
}

function* onHideHoods({ hoodGeoJSON }: HoodMap, action: HoodIdsAction) {
  const hoodIds = action.payload;
  const hoodPropsMap = yield select(getHoodPropsByIds, { ids: hoodIds });
  Object.keys(hoodPropsMap).forEach((key) => {
    hoodPropsMap[key].visible = false;
  });
  yield put(addHoodProps(hoodPropsMap));

  hoodGeoJSON.eachLayer((hood) => {
    const hoodId = getHoodId(hood);

    if (hoodIds.indexOf(hoodId) === -1) {
      return;
    }

    hoodGeoJSON.removeLayer(hood);
  });
}

function* onShowHoods({ hoodGeoJSON }: HoodMap, action: HoodIdsAction) {
  const hoodIds = action.payload;
  const hoods = yield select(getHoodsByIds, { ids: hoodIds });
  hoodGeoJSON.addData(hoods);
}

export function* showHoodsSaga(hoodMap: HoodMap) {
  yield takeEvery(SHOW_HOODS, onShowHoods, hoodMap);
}
export function* hideHoodsSaga(hoodMap: HoodMap) {
  yield takeEvery(HIDE_HOODS, onHideHoods, hoodMap);
}

function* prepareHoods(layers: PolygonLeaflet[]) {
  const hoodPropsMap = getHoodPropsMapFromHoods(layers);
  yield put(addHoodProps(hoodPropsMap));


  for (let i = 0; i < layers.length; i += 1) {
    const hood = <PolygonLeaflet>layers[i];
    hood.setStyle(styleFn());
    yield spawn(startHoodEvents, hood);
  }
}

export function* drawHoodSaga(hoodMap: HoodMap) {
  yield takeEvery(DRAW_HOOD, onDrawHood, hoodMap);
}

function onDrawHood({ map, drawControl }: HoodMap) {
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

function transformUser(rawUser: RawUser): User {
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
  const hoodIdSelected = yield select(getHoodIdSelected);
  if (hoodId === hoodIdSelected) {
    return;
  }
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
