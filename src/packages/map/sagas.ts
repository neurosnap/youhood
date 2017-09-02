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
  addHoods,
} = actionCreators;
const { showMenu } = menuActionCreators;

const LAYER_ADD = 'LAYER_ADD';
const MAP_CLICK = 'MAP_CLICK';

interface LayerAddAction {
  type: string;
  payload: Hood;
}

interface MapClickAction {
  type: string;
  payload: Hoods;
}

const createMapChannel = ({ map, hoodGeoJSON }: HoodMap) => eventChannel((emit) => {
  const onLayerAdd = (event: L.LayerEvent) => {
    const layer = <L.Polygon>event.layer;
    const polygon = <Hood>layer.toGeoJSON();
    emit({ type: LAYER_ADD, payload: polygon });
  };

  const onMapClick = (event: L.LeafletMouseEvent) => {
    const polygons: Hoods = leafletPip.pointInLayer(event.latlng, hoodGeoJSON);
    emit({ type: MAP_CLICK, payload: polygons });
  };

  const onDrawCreated = (event: L.LayerEvent) => {
    const layer = <L.Polygon>event.layer;
    const hood = layer.toGeoJSON();
    hood.properties = createHood();
    hoodGeoJSON.addData(hood);
  };

  hoodGeoJSON.on('layeradd', onLayerAdd);
  map.on('click', onMapClick);
  map.on(L.Draw.Event.CREATED, onDrawCreated);

  return () => {
    hoodGeoJSON.off('layeradd', onLayerAdd);
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
      case LAYER_ADD:
        yield spawn(layerAdd, event);
        break;
      case MAP_CLICK:
        yield spawn(mapClick, event);
      default:
        break;
    }
  }
}

function* layerAdd(action: LayerAddAction) {
  const polygon = action.payload;
  const hoodId = getHoodId(polygon);
  yield put(selectHood(hoodId));
  yield put(addHoods([polygon]));
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
