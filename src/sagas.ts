import { all, spawn } from 'redux-saga/effects';

import { sagas } from './packages/hood';
import { sagas as socketSagas } from './packages/socket';
import { sagas as mapSagas } from './packages/map';
import { sagas as pointSagas } from './packages/point';
import { sagas as authSagas } from './packages/auth';
import { sagas as voteSagas } from './packages/vote';
import { HoodMap } from './types';

const prepSagas = (hoodMap: HoodMap) => (sag: Object) =>
  Object.values(sag).map((saga) => spawn(saga, hoodMap));

export default function* rootSaga(hoodMap: HoodMap) {
  const sagaExec = prepSagas(hoodMap);

  yield all([
    ...sagaExec(sagas),
    ...sagaExec(socketSagas),
    ...sagaExec(mapSagas),
    ...sagaExec(pointSagas),
    ...sagaExec(authSagas),
    ...sagaExec(voteSagas),
  ]);
}
