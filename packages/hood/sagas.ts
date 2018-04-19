import * as L from 'leaflet';
import 'leaflet-draw';
import { race, put, call, select, takeEvery, spawn, take } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

import { HoodMap, HoodGeoJSON } from '@youhood/map/types';
import { actionCreators } from '@youhood/menu';
const { showMenu, hideMenu } = actionCreators;
import { actionCreators as userActionCreators, utils as userUtils, selectors } from '@youhood/user';
const { addUsers, setUser } = userActionCreators;
const { createUser } = userUtils;
const { getCurrentUser } = selectors;
import { User, RawUser } from '@youhood/user/types';

import {
  DESELECT_HOOD,
  SELECT_HOOD,
  TOGGLE_HOOD_SELECTED,
  HOVER_HOOD,
  EDIT_HOOD,
  SAVE_HOOD,
  DRAW_HOOD,
  HOOD_CREATED,
  CANCEL_DRAW_HOOD,
  HIDE_HOODS,
  SHOW_HOODS,
  HIDE_ALL_HOODS,
  SHOW_ALL_HOODS,
} from './action-types';
import {
  selectHood,
  deselectHood,
  setEdit,
  setHoodUIProps,
  userAddHoods,
  addHoodUIProps,
} from './action-creators';
import styleFn from './style';
import {
  getHoodIdSelected,
  getHoodSelected,
  getHoodUIPropsAsIds,
} from './selectors';
import {
  findHood,
  getHoodId,
  createHood,
  createHoodUI,
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
  DrawCreatedAction,
} from './types';

const LAYER_ADD = 'layeradd';

const createLayerChannel = (layerGroup: HoodGeoJSON) => eventChannel((emit: any) => {
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
  const hoodIds = yield select(getHoodUIPropsAsIds);
  const hoodUIProps = setHoodUIVisibility(hoodIds, false);
  yield put(setHoodUIProps(hoodUIProps));
  setHoodDisplay({ hoodGeoJSON, hoodIds, display: 'none' });
}

function* onShowAllHoods({ hoodGeoJSON }: HoodMap) {
  const hoodIds = yield select(getHoodUIPropsAsIds);
  const hoodUIProps = setHoodUIVisibility(hoodIds, true);
  yield put(setHoodUIProps(hoodUIProps));
  setHoodDisplay({ hoodGeoJSON, hoodIds, display: 'block' });
}

function* onHideHoods({ hoodGeoJSON }: HoodMap, action: HoodIdsAction) {
  const hoodIds = action.payload;
  const hoodUIProps = setHoodUIVisibility(hoodIds, false);
  yield put(setHoodUIProps(hoodUIProps));
  setHoodDisplay({ hoodGeoJSON, hoodIds, display: 'none' });
}

function* onShowHoods({ hoodGeoJSON }: HoodMap, action: HoodIdsAction) {
  const hoodIds = action.payload;
  const hoodUIProps = setHoodUIVisibility(hoodIds, true);
  yield put(setHoodUIProps(hoodUIProps));
  setHoodDisplay({ hoodGeoJSON, hoodIds, display: 'block' });
}

function setHoodUIVisibility(hoodIds: HoodIds, visible: boolean) {
  const init = {};
  return hoodIds.reduce(
    (acc: Object, hoodId: HoodId) => ({ ...acc, [hoodId]: { visible } }), 
    init,
  );
}

interface SetHoodDisplay {
  hoodGeoJSON: HoodGeoJSON; 
  hoodIds: HoodIds; 
  display: string;
}

function setHoodDisplay({ hoodGeoJSON, hoodIds, display }: SetHoodDisplay) {
  hoodGeoJSON.eachLayer((hood: PolygonLeaflet) => {
    const hoodId = getHoodId(hood);

    if (hoodIds.indexOf(hoodId) === -1) {
      return;
    }

    (<HTMLElement>hood.getElement()).style.display = display;
  });
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

function* onDrawHood({ map }: HoodMap) {
  yield put(setEdit(true));
  const poly = new L.Draw.Polygon(map);
  poly.enable();

  const winner = yield race({
    cancel: take(CANCEL_DRAW_HOOD),
    create: take(HOOD_CREATED),
  });

  if (winner.cancel) {
    poly.disable();
    yield put(setEdit(false));
  }
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
  const userId = hood.userId;
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

function* onHoodCreated({ hoodGeoJSON }: HoodMap, action: DrawCreatedAction) {
  const layer = action.payload;
  const hood = layer.toGeoJSON();

  yield put(setEdit(false));

  let user = yield select(getCurrentUser);
  if (!user) {
    user = createUser();
    yield put(addUsers([user]));
    yield put(setUser(user.id));
  }

  const props = createHood({ userId: user.id });
  hoodGeoJSON.addData(hood);
  hood.properties = props;
  const hoodId = getHoodId(hood);
  const uiProps = createHoodUI({ id: hoodId });
  yield put(addHoodUIProps({ [hoodId]: uiProps }));
  yield put(userAddHoods([hood]));
  yield put(selectHood(hoodId));
}

export function* hoodCreatedSaga(hoodMap: HoodMap) {
  yield takeEvery(HOOD_CREATED, onHoodCreated, hoodMap);
}
