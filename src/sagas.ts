/* @flow */
import { all, spawn } from 'redux-saga/effects';

import { sagas } from './packages/hood';

const prepSagas = (sag) => Object.values(sag).map((saga) => spawn(saga));

export default function* rootSaga(): Generator<*, *, *> {
  yield all([
    ...prepSagas(sagas),
  ]);
}
