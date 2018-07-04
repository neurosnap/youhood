import { put, takeEvery } from 'redux-saga/effects';

import { typeCreator } from '@youhood/shared';

// action-types
const { WEB_BOOTUP, WEB_BOOTUP_COMPLETE } = typeCreator;

const actionTypes = {
  WEB_BOOTUP,
  WEB_BOOTUP_COMPLETE,
};

// action-creators
const webBootup = () => ({ type: WEB_BOOTUP });
const webBootupComplete = () => ({ type: WEB_BOOTUP_COMPLETE });

const actionCreators = {
  webBootup,
  webBootupComplete,
};

// effects
function* onBootup() {
  yield put(webBootupComplete());
}

const effects = {
  onBootup,
};

// sagas
function* bootupSaga() {
  yield takeEvery(WEB_BOOTUP, onBootup);
}

const sagas = {
  bootupSaga,
};

export {
  actionTypes,
  actionCreators,
  sagas,
  effects,
};
