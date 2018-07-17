import { put, takeEvery } from 'redux-saga/effects';

import { creator } from '@youhood/shared';

// actions
const webBootup = creator('WEB_BOOTUP');
const webBootupComplete = creator('WEB_BOOTUP_COMPLETE');

const actions = {
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
  yield takeEvery(`${webBootup}`, onBootup);
}

const sagas = {
  bootupSaga,
};

export { actions, sagas, effects };
