import { takeEvery, call, put } from 'redux-saga/effects';

import { actionCreators } from '@youhood/user';
import { User } from '@youhood/user/types';
const { addUsers, setUser, resetUser } = actionCreators;
import { actionCreators as pointActionCreators } from '@youhood/point';
const { resetPoints } = pointActionCreators;

import { Token, AuthError, AuthAction } from './types';
import {
  setToken,
  authError,
  resetToken,
  signIn,
  signedIn,
  signOut,
  signedOut,
  register,
} from './actions';

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
    yield put(signedIn(result.user.id));
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
  yield put(signedOut());
}

function* onRegister(action: AuthAction) {
  const resp = yield call(fetch, '/auth/register', {
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
    yield put(signedIn(result.user.id));
    return;
  }

  if (resp.status >= 400) {
    const result: FailureJSON = yield resp.json();
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
