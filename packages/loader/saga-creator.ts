import { spawn, all } from 'redux-saga/effects';

import { Gentors } from './types';

export const prepSagas = (sagas = {}, ...options: any[]): any[] =>
  Object
    .values(sagas)
    .map((saga) => spawn.call(this, saga, ...options));

export default function (sagas: Gentors): any {
  return function* rootSaga(...options: any[]) {
    yield all(prepSagas(sagas, ...options));
  };
}
