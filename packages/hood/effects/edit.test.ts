import { put } from 'redux-saga/effects';
import * as expectGen from 'expect-gen';

import { setEdit } from '../action-creators';
import { mockHoodMap } from '../mock';
import { onEditHood } from './edit';

describe('onEditHood', () => {
  const hoodMap = mockHoodMap({ onlyGeoJSON: true });

  it('when hood does not exist', () => {
    expectGen(onEditHood, hoodMap, { payload: { hoodId: '123', edit: false } })
      .next(null) // findHood
      .finishes()
      .run();
  });

  describe('when edit is `true`', () => {
    const action = {
      payload: {
        hoodId: '123',
        edit: true,
      },
    };
    const hood = {
      editing: {
        enable: jest.fn(),
        disable: jest.fn(),
      },
    };

    it('should set edit to `true`', () => {
      expectGen(onEditHood, hoodMap, action)
        .next(hood) // findHood
        .yields(put(setEdit(true)))
        .finishes()
        .run();
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
      editing: {
        enable: jest.fn(),
        disable: jest.fn(),
      },
    };

    it('should set edit to `false`', () => {
      expectGen(onEditHood, hoodMap, action)
        .next(hood) // findHood
        .yields(put(setEdit(false)))
        .finishes()
        .run();
    });

    it('should not call enable', () => {
      expect(hood.editing.enable).not.toHaveBeenCalled();
    });

    it('should should call disable', () => {
      expect(hood.editing.disable).toHaveBeenCalled();
    });
  });
});
