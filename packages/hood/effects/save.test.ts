import { put, call } from 'redux-saga/effects';
import { genTester, yields, skip } from 'gen-tester';

import apiFetch from '@youhood/fetch';

import { mockHoodMap } from '../mock';
import { afterSaveHood } from '../actions';
import { createHood } from '../utils';
import { Hoods } from '../types';
import { onSaveHood } from './save';

describe('onSaveHood', () => {
  const hoodMap = mockHoodMap({ onlyGeoJSON: true });

  describe('when cannot find hood', () => {
    it('should exit early', () => {
      const tester = genTester(onSaveHood, hoodMap, { payload: '123' });
      const { actual, expected } = tester(skip());
      expect(actual).toEqual(expected);
    });
  });

  describe('when cannot find props for hood', () => {
    it('should exit early', () => {
      const tester = genTester(onSaveHood, hoodMap, { payload: '123' });
      const { actual, expected } = tester(skip({}), skip());
      expect(actual).toEqual(expected);
    });
  });

  describe('when saving returns a 400 status', () => {
    const hood = {
      toGeoJSON: jest.fn(),
    };
    hood.toGeoJSON.mockReturnValue({});
    const properties = { id: '123' };
    const hoodGeo = {
      properties,
    };

    it('should return early', () => {
      const tester = genTester(onSaveHood, hoodMap, { payload: '123' });
      const { actual, expected } = tester(
        skip(hood), // findHood
        skip(properties), // getHoodPropsById
        skip(), // bindTooltip
        yields(
          call(apiFetch, '/hood/save', {
            method: 'POST',
            body: JSON.stringify([hoodGeo]),
            headers: {
              'Content-Type': 'application/json',
            },
          }),
          { status: 400 },
        ),
      );

      expect(actual).toEqual(expected);
    });

    it('should call `toGeoJSON`', () => {
      expect(hood.toGeoJSON).toHaveBeenCalled();
    });
  });

  describe('when saving returns a 200 status', () => {
    const hood = {
      toGeoJSON: jest.fn(),
    };
    hood.toGeoJSON.mockReturnValue({});
    const properties = { id: '123' };
    const hoodGeo = {
      properties,
    };
    const hoods: Hoods = [
      {
        type: 'Feature',
        properties: createHood({ id: '123' }),
        geometry: null,
      },
    ];

    it('should return early', () => {
      const tester = genTester(onSaveHood, hoodMap, { payload: '123' });
      const { actual, expected } = tester(
        skip(hood), // findHood
        skip(properties), // getHoodPropsById
        skip(), // bindTooltip
        yields(
          call(apiFetch, '/hood/save', {
            method: 'POST',
            body: JSON.stringify([hoodGeo]),
            headers: {
              'Content-Type': 'application/json',
            },
          }),
          { status: 200, body: { hoods } },
        ),
        put(afterSaveHood(hoods)),
      );

      expect(actual).toEqual(expected);
    });

    it('should call `toGeoJSON`', () => {
      expect(hood.toGeoJSON).toHaveBeenCalled();
    });
  });
});
