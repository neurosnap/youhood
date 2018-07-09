import { genTester, yields } from 'gen-tester';
import { call, put, take, race } from 'redux-saga/effects';

import { mockHoodMap, cleanupHoodMap } from '../mock';
import { setEdit, cancelDrawHood, hoodCreated } from '../actions';
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
      const tester = genTester(onDrawHood, hoodMap);
      const { actual, expected } = tester(
        put(setEdit(true)),
        yields(call(createPolygon, hoodMap), mock),
        yields(
          race({
            cancel: take(`${cancelDrawHood}`),
            create: take(`${hoodCreated}`),
          }),
          { create: true },
        ),
      );

      expect(actual).toEqual(expected);
    });

    it('should call enable', () => {
      expect(mock.enable).toHaveBeenCalled();
    });
  });

  describe('if drawing hood was cancelled', () => {
    const mock = mockLPolygon();

    it('should enable drawing', () => {
      const tester = genTester(onDrawHood, hoodMap);
      const { actual, expected } = tester(
        put(setEdit(true)),
        yields(call(createPolygon, hoodMap), mock),
        yields(
          race({
            cancel: take(`${cancelDrawHood}`),
            create: take(`${hoodCreated}`),
          }),
          { cancel: true },
        ),
        put(setEdit(false)),
      );

      expect(actual).toEqual(expected);
    });

    it('should call enable', () => {
      expect(mock.enable).toHaveBeenCalled();
    });
  });
});
