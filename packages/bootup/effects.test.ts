import { genTester } from 'gen-tester';
import { put } from 'redux-saga/effects';

import { actions, effects } from './index';
const { webBootupComplete } = actions;

describe('onBootup', () => {
  it('should call actions', () => {
    const tester = genTester(effects.onBootup);
    const { actual, expected } = tester(put(webBootupComplete()));
    expect(actual).toEqual(expected);
  });
});
