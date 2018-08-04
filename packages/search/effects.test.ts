import { genTester, yields } from 'gen-tester';

import { effects } from '.';
import { call } from '../../node_modules/redux-saga/effects';
const { onSearch } = effects;

describe('onSearch', () => {
  describe('when there are no results', () => {
    it('should exit early', () => {
      const resp = { json: jest.fn() };
      const hoodMap = { map: { setView: jest.fn() } };
      const tester = genTester(onSearch, hoodMap, { payload: 'ann arbor' });
      const url =
        'https://maps.googleapis.com/maps/api/geocode/json?address=ann+arbor&key=AIzaSyD5U15XGats0Dd7oRZ2ke_jXm8vX7SYIJE';
      const { actual, expected } = tester(
        yields(call(fetch, url), resp),
        yields(call([resp, 'json']), { results: [], status: 'OK' }),
      );

      expect(actual).toEqual(expected);
    });
  });

  describe('when there are results', () => {
    it('should set map view', () => {
      const resp = { json: jest.fn() };
      const hoodMap = { map: { setView: jest.fn() } };
      const tester = genTester(onSearch, hoodMap, { payload: 'ann arbor' });
      const url =
        'https://maps.googleapis.com/maps/api/geocode/json?address=ann+arbor&key=AIzaSyD5U15XGats0Dd7oRZ2ke_jXm8vX7SYIJE';
      const results = [{ geometry: { location: { lat: 1.0, lng: -1.0 } } }];
      const { actual, expected } = tester(
        yields(call(fetch, url), resp),
        yields(call([resp, 'json']), { results, status: 'OK' }),
        yields(call([hoodMap.map, 'setView'], [1.0, -1.0], 13)),
      );

      expect(actual).toEqual(expected);
    });
  });
});
