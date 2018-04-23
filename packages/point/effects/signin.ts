import { put } from 'redux-saga/effects';

import { SignedInAction } from '@youhood/auth/types';

import { fetchPointsByUser } from '../action-creators';

export function* onSignedIn(action: SignedInAction) {
  const userId = action.payload;
  yield put(fetchPointsByUser(userId));
}
