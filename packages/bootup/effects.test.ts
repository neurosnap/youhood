import { genTester, skip, yields } from 'gen-tester';
import { put, take, call } from 'redux-saga/effects';
import { REHYDRATE } from 'redux-persist';

import { actions, effects } from './index';
import { actions as pointActions } from '@youhood/point';
const { fetchPointsByUser } = pointActions;
const { webBootupComplete } = actions;
import * as user from '@youhood/user';
const { setCurrentUser } = user.actions;
const { onFetchUser } = user.effects;

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
      const user = { id: '1234', email: '1234' };
      const tester = genTester(effects.onBootup);
      const { actual, expected } = tester(
        take(REHYDRATE),
        skip('1234'),
        yields(call(onFetchUser, { type: '', payload: '1234' }), user),
        put(setCurrentUser(user)),
        put(fetchPointsByUser('1234')),
        put(webBootupComplete()),
      );
      expect(actual).toEqual(expected);
    });
  });
});
