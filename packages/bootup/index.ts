import { take, put, takeEvery, select, call } from 'redux-saga/effects';
import { REHYDRATE } from 'redux-persist';

import { creator } from '@youhood/shared';

import { actions as pointActions } from '@youhood/point';
import {
  selectors as userSelectors,
  actions as userActions,
  effects as userEffects,
} from '@youhood/user';
const { getCurrentUserId } = userSelectors;
const { setCurrentUser } = userActions;
const { onFetchUser } = userEffects;
const { fetchPointsByUser } = pointActions;

const webBootup = creator('WEB_BOOTUP');
const webBootupComplete = creator('WEB_BOOTUP_COMPLETE');

const actions = {
  webBootup,
  webBootupComplete,
};

function* onBootup() {
  yield take(REHYDRATE);
  const userId = yield select(getCurrentUserId);
  if (userId) {
    const user = yield call(onFetchUser, { type: '', payload: userId });
    yield put(setCurrentUser(user));
    yield put(fetchPointsByUser(userId));
  }
  yield put(webBootupComplete());
}

const effects = {
  onBootup,
};

function* bootupSaga() {
  yield takeEvery(`${webBootup}`, onBootup);
}

const sagas = {
  bootupSaga,
};

export { actions, sagas, effects };
