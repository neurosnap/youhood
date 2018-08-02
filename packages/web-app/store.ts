import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import {
  createStore,
  applyMiddleware,
  Middleware,
  Store,
  Reducer,
} from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import * as debug from 'debug';

import { HoodMap } from '@youhood/map/types';

import { State } from './types';

const log = debug('app:saga:error');

interface Props {
  initState?: State;
  hoodMap: HoodMap;
  rootReducer: Reducer<State>;
  rootSaga: any;
}

const persistConfig = {
  key: 'youhood',
  storage,
  whitelist: ['currentUser', 'users', 'token'],
};

export default function createState({
  initState,
  hoodMap,
  rootReducer,
  rootSaga,
}: Props): Store<State> {
  const sagaMiddleware = createSagaMiddleware({
    onError: log,
  });
  const middleware: Middleware[] = [sagaMiddleware];
  const persistedReducer = persistReducer(persistConfig, rootReducer);

  if (process.env.NODE_ENV === 'development') {
    middleware.push(logger);
  }

  const store = createStore(
    persistedReducer,
    initState,
    applyMiddleware(...middleware),
  );
  sagaMiddleware.run(rootSaga, hoodMap);

  persistStore(store);
  return store;
}
