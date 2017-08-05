import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import { createStore, applyMiddleware, Middleware, Store } from 'redux';

import rootReducer from './reducers';
import rootSaga from './sagas';
import { State } from './types';

export default function createState(initState?: State): Store<State> {
  const sagaMiddleware = createSagaMiddleware();
  const middleware: Middleware[] = [sagaMiddleware];

  if (process.env.NODE_ENV === 'development') {
    middleware.push(
      logger,
    );
  }

  const store: Store<State> = createStore(
    rootReducer,
    initState,
    applyMiddleware(...middleware),
  );
  sagaMiddleware.run(rootSaga);
  return store;
}
