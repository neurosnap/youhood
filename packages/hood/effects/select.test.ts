import { call, put } from 'redux-saga/effects';
import { genTester, yields, skip } from 'gen-tester';

import apiFetch from '@youhood/fetch';
import { actionCreators } from '@youhood/menu';
const { hideMenu, showMenu } = actionCreators;
import { actionCreators as userActionCreators } from '@youhood/user';
const { addUsers } = userActionCreators;

import {
  transformUser,
  onSelectHood,
  onDeselectHood,
  toggleHoodSelected,
} from './select';
import { deselectHood, selectHood } from '../actions';
import { mockHoodMap } from '../mock';
import { applyStyle } from '../utils';

const hoodMap = mockHoodMap({ onlyGeoJSON: true });

describe('transformUser', () => {
  describe('when there is no user input', () => {
    it('should return null', () => {
      const actual = transformUser(undefined);
      expect(actual).toEqual(null);
    });
  });

  describe('when there is a user input', () => {
    it('should return the correct json object', () => {
      const actual = transformUser({
        id: '123',
        email: 'eric@cool.com',
        created_at: '01-01-2018',
        is_tmp: false,
      });

      expect(actual).toEqual({
        id: '123',
        email: 'eric@cool.com',
        createdAt: '01-01-2018',
        isTmp: false,
      });
    });
  });
});

describe('toggleHoodSelected', () => {
  describe('when hoodId payload matches hoodIdSelected', () => {
    it('should hide menu', () => {
      const hoodId = '123';
      const tester = genTester(toggleHoodSelected, hoodMap, {
        payload: hoodId,
      });
      const { actual, expected } = tester(
        skip(hoodId),
        put(deselectHood()),
        put(hideMenu('overlay')),
      );

      expect(actual).toEqual(expected);
    });
  });

  describe('when hoodId payload does not match hoodIdSelected', () => {
    it('should select hood', () => {
      const hoodId = '123';
      const tester = genTester(toggleHoodSelected, hoodMap, {
        payload: hoodId,
      });
      const { actual, expected } = tester(
        skip('333'),
        put(deselectHood()),
        put(selectHood(hoodId)),
      );

      expect(actual).toEqual(expected);
    });
  });
});

describe('onSelectHood', () => {
  describe('when the fetch user returns 400 status', () => {
    it('should return early', () => {
      const hoodId = '123';
      const style = {
        selected: true,
      };
      const hood = {
        userId: '321',
      };

      const tester = genTester(onSelectHood, hoodMap, { payload: hoodId });
      const { actual, expected } = tester(
        call(onDeselectHood, hoodMap),
        call(applyStyle, { hoodMap, hoodId, style }),
        put(showMenu('overlay')),
        skip(hood),
        yields(call(apiFetch, `/user/${hood.userId}`), {
          status: 400,
          body: {},
        }),
      );

      expect(actual).toEqual(expected);
    });
  });

  describe('when the fetch user returns 200 status', () => {
    it('should return early', () => {
      const hoodId = '123';
      const style = {
        selected: true,
      };
      const hood = {
        userId: '321',
      };
      const user = {
        id: '123',
        email: 'eric@cool.com',
        is_tmp: false,
        created_at: '',
      };
      const tUser = transformUser(user);

      const tester = genTester(onSelectHood, hoodMap, { payload: hoodId });
      const { actual, expected } = tester(
        call(onDeselectHood, hoodMap),
        call(applyStyle, { hoodMap, hoodId, style }),
        put(showMenu('overlay')),
        skip(hood),
        yields(call(apiFetch, `/user/${hood.userId}`), {
          status: 200,
          body: { user },
        }),
        put(addUsers([tUser])),
      );

      expect(actual).toEqual(expected);
    });
  });

  describe('when there is no user', () => {
    it('should not add users to store', () => {
      const hoodId = '123';
      const style = {
        selected: true,
      };
      const hood = {
        userId: '321',
      };

      const tester = genTester(onSelectHood, hoodMap, { payload: hoodId });
      const { actual, expected } = tester(
        call(onDeselectHood, hoodMap),
        call(applyStyle, { hoodMap, hoodId, style }),
        put(showMenu('overlay')),
        skip(hood),
        yields(call(apiFetch, `/user/${hood.userId}`), {
          status: 200,
          body: {},
        }),
      );

      expect(actual).toEqual(expected);
    });
  });
});
