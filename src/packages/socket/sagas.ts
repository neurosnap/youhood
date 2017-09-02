import { eventChannel } from 'redux-saga';
import { take, call } from 'redux-saga/effects';

import {
  HoodMap,
  GeoJsonFeatures,
  HoodGeoJSON,
} from '../../types';

const createSocketChannel = (socket: WebSocket) => eventChannel((emit) => {
  const onOpen = () => {
    console.log('SOCKET CONNECTED');
    socket.send(JSON.stringify({ type: 'get-hoods' }));
  };

  const onMessage = (event: any) => {
    const { type, data } = JSON.parse(event.data);
    console.log(type, data);
    emit({ type, payload: data });
  };

  socket.addEventListener('open', onOpen);
  socket.addEventListener('message', onMessage);

  return () => {
    socket.removeEventListener('open', onOpen);
  };
});

export function* socketSaga({ hoodGeoJSON }: HoodMap) {
  const socket = new WebSocket('ws://localhost:8080');
  const channel = yield call(createSocketChannel, socket);

  /* eslint-disable no-constant-condition */
  while (true) {
    const event = yield take(channel);
    const { type, payload } = event;
    console.log(type, payload);

    switch (type) {
      case 'got-hoods':
        gotHoods(payload, hoodGeoJSON);
      default:
        break;
    }
  }
}

function gotHoods(data: GeoJsonFeatures, hoodGeoJSON: HoodGeoJSON) {
  if (data.features.length === 0) return;
  hoodGeoJSON.addData(data);
}
