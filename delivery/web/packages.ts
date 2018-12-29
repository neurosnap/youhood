import { combineReducers, Reducer } from 'redux';

import use from 'redux-package-loader';
import sagaCreator from 'redux-saga-creator';

import { WebState } from '@youhood/types';

const corePackages = [
  require('@youhood/auth'),
  require('@youhood/menu'),
  require('@youhood/user'),
  require('@youhood/account'),
  require('@youhood/token'),
  require('@youhood/onboard'),
];

const packages = use(corePackages);
const rootReducer: Reducer<WebState> = combineReducers(packages.reducers);
const rootSaga = sagaCreator(packages.sagas);

export { packages, rootReducer, rootSaga };
