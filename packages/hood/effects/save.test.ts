import { put, call } from 'redux-saga/effects';
import * as expectGen from 'expect-gen';

import apiFetch from '@youhood/fetch';

import { mockHoodMap } from '../mock';
import { afterSaveHood } from '../action-creators';
import { createHood } from '../utils';
import { Hoods } from '../types';
import { onSaveHood } from './save';

describe('onSaveHood', () => {
  const hoodMap = mockHoodMap({ onlyGeoJSON: true });

  describe('when cannot find hood', () => {
    it('should exit early', () => {
      expectGen(onSaveHood, hoodMap, { payload: '123' })
        .next(null) // findHood
        .finishes()
        .run();
    });
  });

  describe('when cannot find props for hood', () => {
    it('should exit early', () => {
      expectGen(onSaveHood, hoodMap, { payload: '123' })
        .next({}) // findHood
        .next(null) // getHoodPropsById
        .finishes()
        .run();
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
      expectGen(onSaveHood, hoodMap, { payload: '123' })
        .next(hood) // findHood
        .next(properties) // getHoodPropsById
        .next() // bindTooltip
        .yields(
          call(apiFetch, '/hood/save', {
            method: 'POST',
            body: JSON.stringify([hoodGeo]),
            headers: {
              'Content-Type': 'application/json',
            },
          }),
          { status: 400 },
        )
        .finishes()
        .run();
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
    const hoods: Hoods = [{
      type: 'Feature',
      properties: createHood({ id: '123' }),
      geometry: null,
    }];

    it('should return early', () => {
      expectGen(onSaveHood, hoodMap, { payload: '123' })
        .next(hood) // findHood
        .next(properties) // getHoodPropsById
        .next() // bindTooltip
        .yields(
          call(apiFetch, '/hood/save', {
            method: 'POST',
            body: JSON.stringify([hoodGeo]),
            headers: {
              'Content-Type': 'application/json',
            },
          }),
          { status: 200, body: { hoods } },
        )
        .yields(put(afterSaveHood(hoods)))
        .finishes()
        .run();
    });

    it('should call `toGeoJSON`', () => {
      expect(hood.toGeoJSON).toHaveBeenCalled();
    });
  });
});
