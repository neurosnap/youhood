import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
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

import { WebState } from '@youhood/types';

const log = debug('app:saga:error');

interface Props {
  initState?: WebState;
  rootReducer: Reducer<WebState>;
  rootSaga: any;
}

const persistConfig = {
  key: 'youhood',
  storage,
  whitelist: ['currentUser', 'users', 'token', 'onboard'],
};

export default function createState({
  initState,
  rootReducer,
  rootSaga,
}: Props): { store: Store<WebState>; persistor: Persistor } {
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
  sagaMiddleware.run(rootSaga);

  const persistor = persistStore(store);
  return { store, persistor };
}
