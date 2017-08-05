import { all, spawn } from 'redux-saga/effects';

import { sagas } from './packages/hood';

const prepSagas = (sag: Object) => Object.values(sag).map((saga) => spawn(saga));

export default function* rootSaga() {
  yield all([
    ...prepSagas(sagas),
  ]);
}
