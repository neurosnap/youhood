import { combineReducers, Reducer } from 'redux';

import use from 'redux-package-loader';
import sagaCreator from 'redux-saga-creator';

import { WebState } from '@youhood/types';

const corePackages = [
  require('@youhood/account'),
  require('@youhood/auth'),
  require('@youhood/bootup'),
  require('@youhood/hood-winners'),
  require('@youhood/hood'),
  require('@youhood/map'),
  require('@youhood/menu'),
  require('@youhood/onboard'),
  require('@youhood/point'),
  require('@youhood/report'),
  require('@youhood/search'),
  require('@youhood/socket'),
  require('@youhood/token'),
  require('@youhood/user'),
  require('@youhood/vote'),
];

const packages = use(corePackages);
const rootReducer: Reducer<WebState> = combineReducers(packages.reducers);
const rootSaga = sagaCreator(packages.sagas);

export { packages, rootReducer, rootSaga };
