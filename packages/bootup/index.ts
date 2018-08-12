import { take, put, takeEvery, select } from 'redux-saga/effects';
import { REHYDRATE } from 'redux-persist';

import { creator } from '@youhood/shared';

import { actions as pointActions } from '@youhood/point';
import { selectors as userSelectors } from '@youhood/user';
const { getCurrentUserId } = userSelectors;
const { fetchPointsByUser } = pointActions;

// actions
const webBootup = creator('WEB_BOOTUP');
const webBootupComplete = creator('WEB_BOOTUP_COMPLETE');

const actions = {
  webBootup,
  webBootupComplete,
};

// effects
function* onBootup() {
  yield take(REHYDRATE);
  const userId = yield select(getCurrentUserId);
  if (userId) {
    yield put(fetchPointsByUser(userId));
  }
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
