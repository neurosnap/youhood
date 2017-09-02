import { all, spawn } from 'redux-saga/effects';

import { sagas } from './packages/hood';
import { sagas as socketSagas } from './packages/socket';
import { HoodMap } from './types';

const prepSagas = (hoodMap: HoodMap) => (sag: Object) =>
  Object.values(sag).map((saga) => spawn(saga, hoodMap));

export default function* rootSaga(hoodMap: HoodMap) {
  const sagaExec = prepSagas(hoodMap);

  yield all([
    ...sagaExec(sagas),
    ...sagaExec(socketSagas),
  ]);
}
