import * as L from 'leaflet';
import 'leaflet-draw';
import { pointInLayer } from '@mapbox/leaflet-pip';
import { eventChannel } from 'redux-saga';
import { take, put, spawn, call, select } from 'redux-saga/effects';

import { utils, actions, selectors as hoodSelectors } from '@youhood/hood';
const { toggleHoodSelected, setHoodsOnPoint, hoodCreated } = actions;
const { getHoodId } = utils;
const { getIsEditing } = hoodSelectors;
import { Hood, Hoods } from '@youhood/hood/types';

import { actions as menuActions } from '@youhood/menu';
const { showMenu } = menuActions;

import { HoodMap } from './types';

const MAP_CLICK = 'MAP_CLICK';
const HOOD_CREATED = 'HOOD_CREATED';

interface MapClickAction {
  type: string;
  payload: Hoods;
}

const createMapChannel = ({ map, hoodGeoJSON }: HoodMap) =>
  eventChannel((emit) => {
    const onMapClick = (event: L.LeafletMouseEvent) => {
      const polygons: Hoods = pointInLayer(event.latlng, hoodGeoJSON);
      emit({ type: MAP_CLICK, payload: polygons });
    };

    const onDrawCreated = (event: L.LayerEvent) => {
      const layer = <L.Polygon>event.layer;
      emit({ type: HOOD_CREATED, payload: layer });
    };

    map.on('click', onMapClick as any);
    map.on((<any>L).Draw.Event.CREATED, onDrawCreated as any);

    return () => {
      map.off('click', onMapClick as any);
      map.off((<any>L).Draw.Event.CREATED, onDrawCreated as any);
    };
  });

export function* mapSaga(hoodMap: HoodMap) {
  if (!hoodMap) {
    return;
  }

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
        yield put(hoodCreated(event.payload));
        break;
      default:
        break;
    }
  }
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
