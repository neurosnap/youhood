import { put } from 'redux-saga/effects';
import { genTester, skip } from 'gen-tester';

import { setEdit } from '../action-creators';
import { mockHoodMap } from '../mock';
import { onEditHood } from './edit';

describe('onEditHood', () => {
  const hoodMap = mockHoodMap({ onlyGeoJSON: true });

  it('when hood does not exist', () => {
    const tester = genTester(onEditHood, hoodMap, {
      payload: { hoodId: '123', edit: false },
    });
    const { actual, expected } = tester(skip());

    expect(actual).toEqual(expected);
  });

  describe('when edit is `true`', () => {
    const action = {
      payload: {
        hoodId: '123',
        edit: true,
      },
    };
    const hood = {
      options: {},
      editing: {
        enable: jest.fn(),
        disable: jest.fn(),
      },
    };

    it('should set edit to `true`', () => {
      const tester = genTester(onEditHood, hoodMap, action);
      const { actual, expected } = tester(skip(hood), put(setEdit(true)));
      expect(actual).toEqual(expected);
    });

    it('should enable editing', () => {
      expect(hood.editing.enable).toHaveBeenCalled();
    });

    it('should not call disable', () => {
      expect(hood.editing.disable).not.toHaveBeenCalled();
    });
  });

  describe('when edit is `false`', () => {
    const action = {
      payload: {
        hoodId: '123',
        edit: false,
      },
    };
    const hood = {
      options: {},
      editing: {
        enable: jest.fn(),
        disable: jest.fn(),
      },
    };

    it('should set edit to `false`', () => {
      const tester = genTester(onEditHood, hoodMap, action);
      const { actual, expected } = tester(skip(hood), put(setEdit(false)));

      expect(actual).toEqual(expected);
    });

    it('should not call enable', () => {
      expect(hood.editing.enable).not.toHaveBeenCalled();
    });

    it('should should call disable', () => {
      expect(hood.editing.disable).toHaveBeenCalled();
    });
  });
});
