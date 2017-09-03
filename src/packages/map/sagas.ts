import * as L from 'leaflet';
import 'leaflet-draw';
import * as leafletPip from '@mapbox/leaflet-pip';
import { eventChannel } from 'redux-saga';
import { take, put, spawn, call } from 'redux-saga/effects';

import {
  Hood,
  Hoods,
  HoodMap,
} from '../../types';
import { utils, actionCreators } from '../../packages/hood';
import { actionCreators as menuActionCreators } from '../../packages/menu';

const { createHood, getHoodId } = utils;
const {
  selectHood,
  toggleHoodSelected,
  setHoodsOnPoint,
  userAddHoods,
} = actionCreators;
const { showMenu } = menuActionCreators;

const MAP_CLICK = 'MAP_CLICK';
const DRAW_CREATED = 'DRAW_CREATED';

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
    hood.properties = createHood();
    hoodGeoJSON.addData(hood);
    emit({ type: DRAW_CREATED, payload: hood });
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

  /* eslint-disable no-constant-condition */
  while (true) {
    const event = yield take(channel);
    const { type, payload } = event;
    console.log(type, payload);

    switch (type) {
      case MAP_CLICK:
        yield spawn(mapClick, event);
        break;
      case DRAW_CREATED:
        yield spawn(drawCreated, event);
        break;
      default:
        break;
    }
  }
}

function* drawCreated(action: DrawCreatedAction) {
  const hood = action.payload;
  const hoodId = getHoodId(hood);
  yield put(selectHood(hoodId));
  yield put(userAddHoods([hood]));
}

function* mapClick(action: MapClickAction) {
  const polygons = action.payload;

  if (polygons.length === 0) {
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
