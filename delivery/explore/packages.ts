import { combineReducers, Reducer } from 'redux';

import use from 'redux-package-loader';
import sagaCreator from 'redux-saga-creator';

import { WebState } from '@youhood/types';

const corePackages = [
  require('@youhood/auth'),
  require('@youhood/bootup'),
  require('@youhood/hood'),
  require('@youhood/map'),
  require('@youhood/menu'),
  require('@youhood/point'),
  require('@youhood/socket'),
  require('@youhood/user'),
  require('@youhood/vote'),
  require('@youhood/search'),
  require('@youhood/onboard'),
  require('@youhood/hood-winners'),
  require('@youhood/account'),
  require('@youhood/token'),
];

const packages = use(corePackages);
const rootReducer: Reducer<WebState> = combineReducers(packages.reducers);
const rootSaga = sagaCreator(packages.sagas);

export { packages, rootReducer, rootSaga };
