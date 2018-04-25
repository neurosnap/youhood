import * as expectGen from 'expect-gen';
import { call, put, take, race } from 'redux-saga/effects';

import { mockHoodMap, cleanupHoodMap } from '../mock';
import { CANCEL_DRAW_HOOD, HOOD_CREATED } from '../action-types';
import { setEdit } from '../action-creators';
import { onDrawHood, createPolygon } from './draw';

const mockLPolygon = () => ({
  enable: jest.fn(),
  disable: jest.fn(),
});

describe('onDrawHood', () => {
  const hoodMap = mockHoodMap();

  afterAll(() => {
    cleanupHoodMap(hoodMap);
  });

  describe('if drawing the hood was not cancelled', () => {
    const mock = mockLPolygon();

    it('should enable drawing', () => {
      expectGen(onDrawHood, hoodMap)
        .yields(put(setEdit(true)))
        .yields(
          call(createPolygon, hoodMap),
          mock,
        )
        .yields(
          race({
            cancel: take(CANCEL_DRAW_HOOD),
            create: take(HOOD_CREATED),
          }),
          { create: true },
        )
        .finishes()
        .run();
    });

    it('should call enable', () => {
      expect(mock.enable).toHaveBeenCalled();
    });
  });

  describe('if drawing hood was cancelled', () => {
    const mock = mockLPolygon();

    it('should enable drawing', () => {
      expectGen(onDrawHood, hoodMap)
        .yields(put(setEdit(true)))
        .yields(
          call(createPolygon, hoodMap),
          mock,
        )
        .yields(
          race({
            cancel: take(CANCEL_DRAW_HOOD),
            create: take(HOOD_CREATED),
          }),
          { cancel: true },
        )
        .yields(put(setEdit(false)))
        .finishes()
        .run();
    });

    it('should call enable', () => {
      expect(mock.enable).toHaveBeenCalled();
    });
  });
});
