import * as L from 'leaflet';
import 'leaflet-draw';
import * as leafletPip from '@mapbox/leaflet-pip';
import { eventChannel } from 'redux-saga';
import { take, put, spawn, call, select } from 'redux-saga/effects';

import { HoodMap } from '@youhood/map/types';
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
} = actionCreators;
const { createHood, getHoodId } = utils;
const { getIsEditing } = hoodSelectors;
import {
  Hood,
  Hoods,
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

const MAP_CLICK = 'MAP_CLICK';
const HOOD_CREATED = 'HOOD_CREATED';

interface MapClickAction {
  type: string;
  payload: Hoods;
}

interface DrawCreatedAction {
  type: string;
  payload: Hood;
}

const createMapChannel = ({ map, hoodGeoJSON }: HoodMap) => eventChannel((emit) => {
  const onMapClick = (event: L.LeafletMouseEvent) => {
    const polygons: Hoods = leafletPip.pointInLayer(event.latlng, hoodGeoJSON);
    emit({ type: MAP_CLICK, payload: polygons });
  };

  const onDrawCreated = (event: L.LayerEvent) => {
    const layer = <L.Polygon>event.layer;
    const hood = layer.toGeoJSON();
    hoodGeoJSON.addData(hood);
    emit({ type: HOOD_CREATED, payload: hood });
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
        yield spawn(hoodCreated, event);
        break;
      default:
        break;
    }
  }
}

function* hoodCreated(action: DrawCreatedAction) {
  const hood = action.payload;

  yield put(setEdit(false));

  let user = yield select(getCurrentUser);
  if (!user) {
    user = createUser();
    yield put(addUsers([user]));
    yield put(setUser(user.id));
  }

  hood.properties = createHood({ userId: user.id });
  yield put(userAddHoods([hood]));
  const hoodId = getHoodId(hood);
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
