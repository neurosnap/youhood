import { all, spawn } from 'redux-saga/effects';

import { sagas } from '@youhood/hood';
import { sagas as socketSagas } from '@youhood/socket';
import { sagas as mapSagas } from '@youhood/map';
import { sagas as pointSagas } from '@youhood/point';
import { sagas as authSagas } from '@youhood/auth';
import { sagas as voteSagas } from '@youhood/vote';
import { HoodMap } from '@youhood/map/types';

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
