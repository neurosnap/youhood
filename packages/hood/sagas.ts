import * as L from 'leaflet';
import 'leaflet-draw';
import { put, call, select, takeEvery, spawn, take } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

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
  HIDE_ALL_HOODS,
  SHOW_ALL_HOODS,
} from './action-types';
import {
  selectHood,
  deselectHood,
  addHoodProps,
  setEdit,
} from './action-creators';
import styleFn from './style';
import {
  getHoodIdSelected,
  getHoodSelected,
  getHoodsByIds,
  getHoodPropsByIds,
  getHoodProps,
  getHoods,
} from './selectors';
import {
  findHood,
  getHoodProperties,
  getHoodId,
} from './utils';
import { onSaveHood, prepareHoods } from './effects';
import {
  HoodSelectedAction,
  ToggleHoodSelectedAction,
  HoverHoodAction,
  EditHoodAction,
  PolygonLeaflet,
  HoodId,
  HoodIds,
  Hood,
} from './types';

const LAYER_ADD = 'layeradd';

const createLayerChannel = (layerGroup: L.GeoJSON) => eventChannel((emit: any) => {
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
        console.log('LAYER ADDED: ', layer);
        yield spawn(prepareHoods, [layer.layer]);
      }

      default:
        break;
    }
  }
}

interface HoodIdsAction {
  type: string;
  payload: HoodIds;
}

function* onHideAllHoods({ hoodGeoJSON }: HoodMap) {
  const hoodPropsMap = yield select(getHoodProps);
  Object.keys(hoodPropsMap).forEach((key) => {
    hoodPropsMap[key].visible = false;
  });
  yield put(addHoodProps(hoodPropsMap));

  hoodGeoJSON.eachLayer((hood) => {
    hoodGeoJSON.removeLayer(hood);
  });
}

function* onShowAllHoods({ hoodGeoJSON }: HoodMap) {
  const hoods = yield select(getHoods);

  const hoodsToAdd: any = Object
    .values(hoods)
    .filter((hood: Hood) => {
      let found = false;

      hoodGeoJSON.eachLayer((hoodGeo) => {
        if (getHoodId(hood) === getHoodId(hoodGeo)) {
          found = true;
        }
      });

      return !found;
    });

  hoodGeoJSON.addData(hoodsToAdd);
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

  const hoodsToAdd = hoods.filter((hood: Hood) => {
    let found = false;

    hoodGeoJSON.eachLayer((hoodGeo) => {
      if (getHoodId(hood) === getHoodId(hoodGeo)) {
        found = true;
      }
    });

    return !found;
  });

  hoodGeoJSON.addData(hoodsToAdd);
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

function* onDrawHood({ map, drawControl }: HoodMap) {
  yield put(setEdit(true));
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

function* onEditHood({ hoodGeoJSON }: HoodMap, action: EditHoodAction) {
  const { hoodId, edit } = action.payload;
  const hood = <any>findHood(hoodGeoJSON, hoodId);
  if (!hood) return;

  if (edit) {
    yield put(setEdit(true));
    hood.editing.enable();
  } else {
    yield put(setEdit(false));
    hood.editing.disable();
  }
}

export function* editHoodSaga(hoodMap: HoodMap) {
  yield takeEvery(EDIT_HOOD, onEditHood, hoodMap);
}
