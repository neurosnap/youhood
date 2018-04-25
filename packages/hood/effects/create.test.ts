import * as expectGen from 'expect-gen';
import { put, call } from 'redux-saga/effects';

import { actionCreators as userActionCreators, utils } from '@youhood/user';
const { addUsers, setUser } = userActionCreators;
const { createUser } = utils;

import {
  setEdit,
  addHoodUIProps,
  userAddHoods,
  selectHood,
} from '../action-creators';
import {
  createHood,
  createHoodUI,
} from '../utils';
import {
  mockHood,
  mockHoodMap,
  cleanupHoodMap,
  mockLayer,
} from '../mock';

import { onHoodCreated } from './create';

describe('onHoodCreated', () => {
  const hoodMap = mockHoodMap();

  afterAll(() => {
    cleanupHoodMap(hoodMap);
  });

  describe('when there is no user selected', () => {
    it('should create the user', () => {
      const user = createUser();
      const hood = mockHood();
      const hoodId = hood.properties.id;
      const uiProps = createHoodUI({ id: hoodId });

      expectGen(onHoodCreated, hoodMap, { payload: mockLayer })
        .yields(put(setEdit(false)))
        .next(null) // getCurrentUser
        .yields(
          call(createUser),
          user,
        )
        .yields(put(addUsers([user])))
        .yields(put(setUser(user.id)))
        .yields(
          call(createHood, { userId: user.id }),
          hood.properties,
        )
        .yields(put(addHoodUIProps({ [hoodId]: uiProps })))
        .yields(put(userAddHoods([hood])))
        .yields(put(selectHood(hoodId)))
        .finishes()
        .run();
    });
  });

  describe('when there is a user selected', () => {
    const user = createUser();
    const hood = mockHood();
    const hoodId = hood.properties.id;
    const uiProps = createHoodUI({ id: hoodId });

    expectGen(onHoodCreated, hoodMap, { payload: mockLayer })
      .yields(put(setEdit(false)))
      .next(user) // getCurrentUser
      .yields(
        call(createHood, { userId: user.id }),
        hood.properties,
      )
      .yields(put(addHoodUIProps({ [hoodId]: uiProps })))
      .yields(put(userAddHoods([hood])))
      .yields(put(selectHood(hoodId)))
      .finishes()
      .run();
  });
});
