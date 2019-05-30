import createSagaMiddleware from 'redux-saga';
import {
  createStore,
  applyMiddleware,
  Middleware,
  Store,
  Reducer,
} from 'redux';
import { persistStore, persistReducer, Persistor } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import * as debug from 'debug';

import { HoodMap } from '@youhood/map/types';
import { WebState } from '@youhood/types';

const log = debug('app:saga:error');

interface Props {
  initState: Partial<WebState>;
  hoodMap: HoodMap;
  rootReducer: Reducer<WebState>;
  rootSaga: any;
}

const persistConfig = {
  key: 'youhood',
  storage,
  whitelist: ['currentUser', 'token', 'onboard'],
};

export default function createState({
  initState,
  hoodMap,
  rootReducer,
  rootSaga,
}: Props): { store: Store<WebState>; persistor: Persistor } {
  const sagaMiddleware = createSagaMiddleware({
    onError: log,
  });
  const middleware: Middleware[] = [sagaMiddleware];
  const persistedReducer = persistReducer(persistConfig, rootReducer);

  if (process.env.NODE_ENV === 'development') {
    const logger = require('redux-logger').default;
    middleware.push(logger);
  }

  const store = createStore(
    persistedReducer,
    initState,
    applyMiddleware(...middleware),
  );
  sagaMiddleware.run(rootSaga, hoodMap);

  const persistor = persistStore(store);
  return { store, persistor };
}
