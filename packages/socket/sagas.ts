import { eventChannel } from 'redux-saga';
import { take, call, spawn, put } from 'redux-saga/effects';

import { HoodMap, HoodGeoJSON } from '@youhood/map/types';
import { Hoods, GeoJsonFeatures } from '@youhood/hood/types';
import { actionCreators } from '@youhood/hood';
const { addHoods } = actionCreators;
import { actionCreators as userActionCreators } from '@youhood/user';
const { addUsers } = userActionCreators;
import { Users } from '@youhood/user/types';

const GOT_HOODS = 'got-hoods';
const GOT_USERS = 'got-users';

const createSocketChannel = (socket: WebSocket) => eventChannel((emit) => {
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

export function* socketSaga({ hoodGeoJSON }: HoodMap) {
  const socket = new WebSocket('ws://localhost:8080');
  const channel = yield call(createSocketChannel, socket);

  /* eslint-disable no-constant-condition */
  while (true) {
    const event = yield take(channel);
    const { type, payload } = event;
    console.log(type, payload);

    switch (type) {
      case GOT_HOODS:
        yield spawn(gotHoods, payload, hoodGeoJSON);
        break;
      case GOT_USERS:
        yield spawn(gotUsers, payload);
      default:
        break;
    }
  }
}

function* gotHoods(data: GeoJsonFeatures, hoodGeoJSON: HoodGeoJSON) {
  if (data.features.length === 0) return;
  hoodGeoJSON.addData(data);
  yield put(addHoods(<Hoods>data.features));
}

function* gotUsers(users: Users) {
  yield put(addUsers(users));
}
