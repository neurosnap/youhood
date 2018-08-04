import { combineReducers, Reducer } from 'redux';

import use from 'redux-package-loader';
import sagaCreator from 'redux-saga-creator';

import { State } from './types';

const corePackages = [
  require('@youhood/auth'),
  require('@youhood/hood'),
  require('@youhood/map'),
  require('@youhood/menu'),
  require('@youhood/point'),
  require('@youhood/socket'),
  require('@youhood/user'),
  require('@youhood/vote'),
  require('@youhood/search'),
];

const packages = use(corePackages);
const rootReducer: Reducer<State> = combineReducers(packages.reducers);
const rootSaga = sagaCreator(packages.sagas);

export { packages, rootReducer, rootSaga };
