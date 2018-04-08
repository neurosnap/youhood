import * as L from 'leaflet';
import 'leaflet-draw';
import * as leafletPip from '@mapbox/leaflet-pip';
import { eventChannel } from 'redux-saga';
import { take, put, spawn, call, select } from 'redux-saga/effects';

import {
  utils,
  actionCreators,
  selectors as hoodSelectors,
} from '@youhood/hood';
const {
  selectHood,
  toggleHoodSelected,
  setHoodsOnPoint,
  userAddHoods,
  setEdit,
  addHoodUIProps,
} = actionCreators;
const { createHood, createHoodUI, getHoodId } = utils;
const { getIsEditing } = hoodSelectors;
import {
  Hood,
  Hoods,
  PolygonLeaflet,
} from '@youhood/hood/types';

import { actionCreators as menuActionCreators } from '@youhood/menu';
const { showMenu } = menuActionCreators;
import {
  utils as userUtils,
  actionCreators as userActionCreators,
  selectors as userSelectors,
} from '@youhood/user';
const { createUser } = userUtils;
const { addUsers, setUser } = userActionCreators;
const { getCurrentUser } = userSelectors;

import { HoodMap } from './types';

const MAP_CLICK = 'MAP_CLICK';
const HOOD_CREATED = 'HOOD_CREATED';

interface MapClickAction {
  type: string;
  payload: Hoods;
}

interface DrawCreatedAction {
  type: string;
  payload: PolygonLeaflet;
}

const createMapChannel = ({ map, hoodGeoJSON }: HoodMap) => eventChannel((emit) => {
  const onMapClick = (event: L.LeafletMouseEvent) => {
    const polygons: Hoods = leafletPip.pointInLayer(event.latlng, hoodGeoJSON);
    emit({ type: MAP_CLICK, payload: polygons });
  };

  const onDrawCreated = (event: L.LayerEvent) => {
    const layer = <L.Polygon>event.layer;
    emit({ type: HOOD_CREATED, payload: layer });
  };

  map.on('click', onMapClick);
  map.on(L.Draw.Event.CREATED, onDrawCreated);

  return () => {
    map.off('click', onMapClick);
    map.off(L.Draw.Event.CREATED, onDrawCreated);
  };
});

export function* mapSaga(hoodMap: HoodMap) {
  const channel = yield call(createMapChannel, hoodMap);

  while (true) {
    const event = yield take(channel);
    const { type, payload } = event;
    console.log(type, payload);

    switch (type) {
      case MAP_CLICK:
        yield spawn(mapClick, event);
        break;
      case HOOD_CREATED:
        yield spawn(hoodCreated, hoodMap, event);
        break;
      default:
        break;
    }
  }
}

function* hoodCreated({ hoodGeoJSON }: HoodMap, action: DrawCreatedAction) {
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

function* mapClick(action: MapClickAction) {
  const polygons = action.payload;

  if (polygons.length === 0) {
    return;
  }

  const isEditing = yield select(getIsEditing);
  if (isEditing) {
    return;
  }

  const hoodIds = polygons.map((polygon: Hood) => getHoodId(polygon));

  yield put(setHoodsOnPoint(hoodIds));

  if (polygons.length === 1) {
    yield put(toggleHoodSelected(getHoodId(polygons[0])));
    return;
  }

  yield put(showMenu('overlay'));
}
