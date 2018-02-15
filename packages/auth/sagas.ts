import { takeEvery, call, put } from 'redux-saga/effects';

import { actionCreators } from '@youhood/user';
import { User } from '@youhood/user/types';
const { addUsers, setUser, resetUser } = actionCreators;
import { actionCreators as pointActionCreators } from '@youhood/point';
const { resetPoints } = pointActionCreators;

import { Token, AuthError, AuthAction } from './types';
import { SIGN_IN, SIGN_OUT, REGISTER } from './action-types';
import { setToken, authError, resetToken } from './action-creators';

interface SuccessJSON {
  user: User;
  token: Token;
}

interface FailureJSON {
  error: AuthError;
}

function* onSignIn(action: AuthAction) {
  const resp = yield call(fetch, '/auth/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(action.payload),
  });

  if (resp.status >= 200 && resp.status < 300) {
    const result: SuccessJSON = yield resp.json();
    yield put(addUsers([result.user]));
    yield put(setUser(result.user.id));
    yield put(setToken(result.token));
    return;
  }

  if (resp.status >= 400) {
    const result: FailureJSON = yield resp.json();
    yield put(authError(result.error));
    return;
  }
}

function* onSignOut() {
  yield put(resetUser());
  yield put(resetToken());
  yield put(resetPoints());
}

function* onRegister(action: AuthAction) {
  const resp = yield call(fetch, '/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(action.payload),
  });
  const body = yield resp.json();
  console.log(body);
}

export function* registerSaga() {
  yield takeEvery(REGISTER, onRegister);
}

export function* signInSaga() {
  yield takeEvery(SIGN_IN, onSignIn);
}

export function* signOutSaga() {
  yield takeEvery(SIGN_OUT, onSignOut);
}
