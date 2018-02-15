import { combineReducers, Reducer } from 'redux';

import { use, sagaCreator } from '@youhood/package-loader';

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
];

const packages = use(corePackages);
const rootReducer: Reducer<State> = combineReducers(packages.reducers);
const rootSaga = sagaCreator(packages.sagas);

export { packages, rootReducer, rootSaga };
