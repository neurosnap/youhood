import { genTester, yields, skip } from 'gen-tester';
import { put, call, select } from 'redux-saga/effects';

import { actionCreators as userActionCreators, utils, selectors } from '@youhood/user';
const { addUsers, setUser } = userActionCreators;
const { createUser } = utils;
const { getCurrentUser } = selectors;

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

      const tester = genTester(onHoodCreated, hoodMap, { payload: mockLayer });
      const yields = (expected: any, returns: any) => ({
        expected,
        returns,
      });
      const { actual, expected } = tester(
        put(setEdit(false)),
        skip(),
        yields(
          call(createUser),
          user,
        ),
        put(addUsers([user])),
        put(setUser(user.id)),
        yields(
          call(createHood, { userId: user.id }),
          hood.properties,
        ),
        put(addHoodUIProps({ [hoodId]: uiProps })),
        put(userAddHoods([hood])),
        put(selectHood(hoodId)),
      );

      expect(actual).toEqual(expected);
    });
  });

  describe('when there is a user selected', () => {
    const user = createUser();
    const hood = mockHood();
    const hoodId = hood.properties.id;
    const uiProps = createHoodUI({ id: hoodId });

    const tester = genTester(onHoodCreated, hoodMap, { payload: mockLayer });
    const { actual, expected } = tester(
      put(setEdit(false)),
      yields(select(getCurrentUser), user),
      yields(call(createHood, { userId: user.id }), hood.properties),
      put(addHoodUIProps({ [hoodId]: uiProps })),
      put(userAddHoods([hood])),
      put(selectHood(hoodId)),
    );

    expect(actual).toEqual(expected);
  });
});
