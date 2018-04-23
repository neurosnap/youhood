import * as expectGen from 'expect-gen';
import { put } from 'redux-saga/effects';

import { actionCreators, effects } from './index';
const { webBootupComplete } = actionCreators;

describe('onBootup', () => {
  it('should call actions', () => {
    expectGen(effects.onBootup)
      .yields(
        put(webBootupComplete()),
      )
      .run();
  });
});
