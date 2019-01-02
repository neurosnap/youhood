import { takeEvery, call, put } from 'redux-saga/effects';

import apiFetch from '@youhood/fetch';
import { actions, transforms } from '@youhood/user';
import { RawUser } from '@youhood/user/types';
const { setCurrentUser, resetCurrentUser } = actions;
const { transformUser } = transforms;
import { actions as tokenActions } from '@youhood/token';
const { setToken, resetToken } = tokenActions;
import { Token } from '@youhood/types';

import { AuthError, AuthAction } from './types';
import {
  authError,
  signIn,
  signedIn,
  signOut,
  signedOut,
  register,
} from './actions';

interface SuccessJSON {
  user: RawUser;
  token: Token;
}

interface FailureJSON {
  error: AuthError;
}

function* onSignIn(action: AuthAction) {
  const resp = yield call(apiFetch, '/auth/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(action.payload),
    auth: false,
  });

  if (resp.status >= 200 && resp.status < 300) {
    const result: SuccessJSON = resp.body;
    yield put(setCurrentUser(transformUser(result.user)));
    yield put(setToken(result.token));
    yield put(signedIn(result.user.id));
    return;
  }

  if (resp.status >= 400) {
    const result: FailureJSON = resp.body;
    yield put(authError(result.error));
    return;
  }
}

function* onSignOut() {
  yield put(resetCurrentUser());
  yield put(resetToken());
  yield put(signedOut());
}

function* onRegister(action: AuthAction) {
  const resp = yield call(apiFetch, '/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(action.payload),
    auth: false,
  });

  if (resp.status >= 200 && resp.status < 300) {
    const result: SuccessJSON = resp.body;
    yield put(setCurrentUser(transformUser(result.user)));
    yield put(setToken(result.token));
    yield put(signedIn(result.user.id));
    return;
  }

  if (resp.status >= 400) {
    const result: FailureJSON = resp.body;
    yield put(authError(result.error));
    return;
  }
}

export function* registerSaga() {
  yield takeEvery(`${register}`, onRegister);
}

export function* signInSaga() {
  yield takeEvery(`${signIn}`, onSignIn);
}

export function* signOutSaga() {
  yield takeEvery(`${signOut}`, onSignOut);
}
