import { genTester } from 'gen-tester';
import { put } from 'redux-saga/effects';

import { actionCreators, effects } from './index';
const { webBootupComplete } = actionCreators;

describe('onBootup', () => {
  it('should call actions', () => {
    const tester = genTester(effects.onBootup);
    const { actual, expected } = tester(put(webBootupComplete()));
    expect(actual).toEqual(expected);
  });
});
