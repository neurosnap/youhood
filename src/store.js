/* @flow */
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import { spawn, all } from 'redux-saga/effects';
import { createStore, applyMiddleware } from 'redux';

import rootReducer from './reducers';
import * as sagas from './sagas';

const prepSagas = (sag: Array<Function>) => Object.values(sag).map((saga) => spawn(saga));

function* rootSaga() {
  yield all([
    ...prepSagas(sagas),
  ]);
}

export default function createState(initState: Object = {}) {
  const sagaMiddleware = createSagaMiddleware();
  const middleware = [sagaMiddleware];

  if (process.env.NODE_ENV === 'development') {
    middleware.push(
      logger,
    );
  }

  const store = createStore(
    rootReducer,
    initState,
    applyMiddleware(...middleware),
  );
  sagaMiddleware.run(rootSaga);
  return store;
}
