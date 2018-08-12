import { genTester, skip } from 'gen-tester';
import { put, take } from 'redux-saga/effects';
import { REHYDRATE } from 'redux-persist';

import { actions, effects } from './index';
import { actions as pointActions } from '@youhood/point';
const { fetchPointsByUser } = pointActions;
const { webBootupComplete } = actions;

describe('onBootup', () => {
  describe('when there is no currentUser', () => {
    it('should exit early', () => {
      const tester = genTester(effects.onBootup);
      const { actual, expected } = tester(
        take(REHYDRATE),
        skip(),
        put(webBootupComplete()),
      );
      expect(actual).toEqual(expected);
    });
  });

  describe('when there is a currentUser', () => {
    it('should fetch points by user', () => {
      const tester = genTester(effects.onBootup);
      const { actual, expected } = tester(
        take(REHYDRATE),
        skip('1234'),
        put(fetchPointsByUser('1234')),
        put(webBootupComplete()),
      );
      expect(actual).toEqual(expected);
    });
  });
});
