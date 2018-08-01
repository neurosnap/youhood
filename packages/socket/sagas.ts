import { eventChannel } from 'redux-saga';
import { take, call, spawn, put } from 'redux-saga/effects';

import { HoodMap } from '@youhood/map/types';
import {
  Hoods,
  GeoJsonFeatures,
  PolygonHood,
  Feature,
} from '@youhood/hood/types';
import { actions, utils } from '@youhood/hood';
const { addHoods, addHoodUIProps } = actions;
const { getHoodId, getHoodUIPropsMapFromHoods } = utils;
import { actions as userActions } from '@youhood/user';
const { addUsers } = userActions;
import { Users } from '@youhood/user/types';
import { domain } from '@youhood/fetch';

const GOT_HOODS = 'got-hoods';
const GOT_USERS = 'got-users';

const createSocketChannel = (socket: WebSocket) =>
  eventChannel((emit) => {
    const onOpen = () => {
      console.log('SOCKET CONNECTED');
      socket.send(JSON.stringify({ type: 'get-hoods' }));
    };

    const onMessage = (event: any) => {
      const { type, data } = JSON.parse(event.data);
      emit({ type, payload: data });
    };

    socket.addEventListener('open', onOpen);
    socket.addEventListener('message', onMessage);

    return () => {
      socket.removeEventListener('open', onOpen);
      socket.removeEventListener('message', onMessage);
    };
  });

const getSocketUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return `ws://${domain}`;
  }

  return `wss://${domain}`;
};

export function* socketSaga(hoodMap: HoodMap) {
  const socket = new WebSocket(getSocketUrl());
  const channel = yield call(createSocketChannel, socket);

  while (true) {
    const event = yield take(channel);
    const { type, payload } = event;
    console.log(type, payload);

    switch (type) {
      case GOT_HOODS:
        yield spawn(gotHoods, payload, hoodMap);
        break;
      case GOT_USERS:
        yield spawn(gotUsers, payload);
      default:
        break;
    }
  }
}

function* gotHoods(data: GeoJsonFeatures, { hoodGeoJSON }: HoodMap) {
  if (data.features.length === 0) {
    return;
  }

  const layers = <Hoods>data.features;
  yield put(addHoods(layers));
  const hoodUIPropsMap = getHoodUIPropsMapFromHoods(layers);
  yield put(addHoodUIProps(hoodUIPropsMap));

  const features = data.features.filter((feature) => {
    let foundHood = false;
    hoodGeoJSON.eachLayer((layer) => {
      if (getHoodId(layer) === getHoodId(<PolygonHood>feature)) {
        foundHood = true;
      }
    });

    return !foundHood;
  });

  data.features = features.map((feature) => {
    if (feature.geometry.type === 'MultiPolygon') {
      return transformMutiPolyToPoly(<Feature<GeoJSON.MultiPolygon>>feature);
    }

    return feature;
  });
  hoodGeoJSON.addData(data);
}

function transformMutiPolyToPoly(
  multiPolygon: Feature<GeoJSON.MultiPolygon>,
): Feature<GeoJSON.Polygon> {
  const poly = {
    ...multiPolygon,
    geometry: {
      ...multiPolygon.geometry,
      type: 'Polygon' as 'Polygon',
      coordinates: multiPolygon.geometry.coordinates[0],
    },
  };

  return poly;
}

function* gotUsers(users: Users) {
  yield put(addUsers(users));
}
