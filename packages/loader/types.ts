import { ReducersMapObject } from 'redux';

export interface Functors {
    [key: string]: Function;
}

export interface Gentors {
    [key: string]: Generator;
}

export type Reducer = Function;
export type ActionType = string;
export interface ActionTypes {
    [key: string]: ActionType;
}

export interface Module {
    [key: string]: any;
    reducers?: ReducersMapObject;
    selectors?: Functors;
    actionTypes?: ActionTypes;
    actionCreators?: Functors;
    components?: Functors;
    sagas?: Gentors;
    effects?: Gentors;
}

export type CombinedModules = Module;
export type Modules = Module[];
