import debug from 'debug';

import { Module, Modules, CombinedModules, ActionTypes, Functors, Gentors } from './types';
import { ReducersMapObject } from 'redux';

const log = debug('app:package-loader');

export function use(modules: Modules = []): CombinedModules {
  const reducers: ReducersMapObject = combine(modules, 'reducers');
  const actionTypes: ActionTypes = combine(modules, 'actionTypes');
  const actionCreators: Functors = combine(modules, 'actionCreators');
  const sagas: Gentors = combine(modules, 'sagas');
  const effects: Gentors = combine(modules, 'effects');
  const selectors: Functors = combine(modules, 'selectors');

  return {
    reducers,
    actionTypes,
    actionCreators,
    sagas,
    selectors,
    effects,
  };
}

export function combine(modules: Modules = [], name: string = '') {
  const merged: any = {};

  if (!name) {
    log('Must provide `combine` with a string, e.g. `reducers`, `sagas`');
    return merged;
  }

  modules.forEach((module: Module) => {
    if (!module.hasOwnProperty(name)) {
      return;
    }

    Object.keys(module[name]).forEach((key) => {
      if (merged.hasOwnProperty(key)) {
        log(`${name} ${key} already exists`);
        return;
      }

      merged[key] = module[name][key];
    });
  });

  if (['sagas', 'reducers'].includes(name) || !window.hasOwnProperty('Proxy'))
    return merged;

  const errorAlreadySent: { [key: string]: boolean } = {};
  return new Proxy(merged, {
    get: (target, prop) => {
      if (typeof prop === 'symbol') {
        return target[prop];
      }

      if (
        !target.hasOwnProperty(prop) &&
        !errorAlreadySent.hasOwnProperty(prop)
      ) {
        log(
          `Attempting to access non-existent property [${prop.toString()}] from [${name}]`,
        );
        errorAlreadySent[prop] = true;
        return undefined;
      }

      return target[prop];
    },
  });
}
