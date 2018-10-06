import { eventChannel } from 'redux-saga';
import { take, call, spawn, put } from 'redux-saga/effects';

import { GeoJsonFeatures } from '@youhood/hood/types';
import { actions as userActions } from '@youhood/user';
const { addUsers } = userActions;
import { Users } from '@youhood/user/types';
import { domain } from '@youhood/fetch';
import { actions } from '@youhood/hood';
const { addHoodsAndProps } = actions;

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

export function* socketSaga() {
  const socket = new WebSocket(getSocketUrl());
  const channel = yield call(createSocketChannel, socket);

  while (true) {
    const event = yield take(channel);
    const { type, payload } = event;
    console.log(type, payload);

    if (!payload) {
      continue;
    }

    switch (type) {
      case GOT_HOODS:
        yield spawn(gotHoods, payload);
        break;
      case GOT_USERS:
        yield spawn(gotUsers, payload);
      default:
        break;
    }
  }
}

function* gotHoods(data: GeoJsonFeatures) {
  yield put(addHoodsAndProps(data));
}

function* gotUsers(users: Users) {
  yield put(addUsers(users));
}
