import { call, put } from 'redux-saga/effects';
import * as expectGen from 'expect-gen';

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
import { deselectHood, selectHood } from '../action-creators';
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
      expectGen(toggleHoodSelected, hoodMap, { payload: hoodId })
        .next(hoodId) // getHoodIdSelected
        .yields(put(deselectHood()))
        .yields(put(hideMenu('overlay')))
        .finishes()
        .run();
    });
  });

  describe('when hoodId payload does not match hoodIdSelected', () => {
    it('should select hood', () => {
      const hoodId = '123';
      expectGen(toggleHoodSelected, hoodMap, { payload: hoodId })
        .next('333') // getHoodIdSelected
        .yields(put(deselectHood()))
        .yields(put(selectHood(hoodId)))
        .finishes()
        .run();
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

      expectGen(onSelectHood, hoodMap, { payload: hoodId })
        .yields(call(onDeselectHood, hoodMap))
        .yields(call(applyStyle, { hoodMap, hoodId, style }))
        .yields(put(showMenu('overlay')))
        .next(hood) // getHoodSelected
        .yields(
          call(apiFetch, `/user/${hood.userId}`),
          { status: 400, body: {} },
        )
        .finishes()
        .run();
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

      expectGen(onSelectHood, hoodMap, { payload: hoodId })
        .yields(call(onDeselectHood, hoodMap))
        .yields(call(applyStyle, { hoodMap, hoodId, style }))
        .yields(put(showMenu('overlay')))
        .next(hood) // getHoodSelected
        .yields(
          call(apiFetch, `/user/${hood.userId}`),
          { status: 200, body: { user } },
        )
        .yields(put(addUsers([tUser])))
        .finishes()
        .run();
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

      expectGen(onSelectHood, hoodMap, { payload: hoodId })
        .yields(call(onDeselectHood, hoodMap))
        .yields(call(applyStyle, { hoodMap, hoodId, style }))
        .yields(put(showMenu('overlay')))
        .next(hood) // getHoodSelected
        .yields(
          call(apiFetch, `/user/${hood.userId}`),
          { status: 200, body: {} },
        )
        .finishes()
        .run();
      });
  });
});
