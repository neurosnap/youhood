import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import { createStore, applyMiddleware, Middleware, Store, Reducer } from 'redux';

import rootReducer from './reducers';
import rootSaga from './sagas';
import { State, HoodMap } from './types';

interface Props {
  initState?: State;
  hoodMap: HoodMap;
}

export default function createState({ initState, hoodMap }: Props): Store<State> {
  const sagaMiddleware = createSagaMiddleware();
  const middleware: Middleware[] = [sagaMiddleware];

  if (process.env.NODE_ENV === 'development') {
    middleware.push(
      logger,
    );
  }

  const store = createStore<State>(
    rootReducer,
    initState,
    applyMiddleware(...middleware),
  );
  sagaMiddleware.run(rootSaga, hoodMap);
  return store;
}
