import { genTester, yields } from 'gen-tester';
import { call } from 'redux-saga/effects';

import { effects } from './index';
const { onSearch, onFetchHoodsByCity } = effects;

describe('onSearch', () => {
  describe('when there are no results', () => {
    it('should exit early', () => {
      const resp = { json: jest.fn() };
      const hoodMap = { map: { setView: jest.fn() } };
      const tester = genTester(
        onSearch,
        hoodMap,
        { payload: 'ann arbor' },
        'ASECRETKEY',
      );
      const url =
        'https://maps.googleapis.com/maps/api/geocode/json?address=ann+arbor&key=ASECRETKEY';
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
      const tester = genTester(
        onSearch,
        hoodMap,
        { payload: 'ann arbor' },
        'ASECRETKEY',
      );
      const url =
        'https://maps.googleapis.com/maps/api/geocode/json?address=ann+arbor&key=ASECRETKEY';
      const results = [
        {
          address_components: [
            { short_name: 'mi', types: ['administrative_area_level_1'] },
            { short_name: 'detroit', types: ['locality'] },
          ],
          geometry: { location: { lat: 1.0, lng: -1.0 } },
        },
      ];
      const { actual, expected } = tester(
        yields(call(fetch, url), resp),
        yields(call([resp, 'json']), { results, status: 'OK' }),
        yields(
          call(onFetchHoodsByCity, {
            payload: { city: 'detroit', state: 'mi' },
          }),
        ),
        yields(call([hoodMap.map, 'setView'], [1.0, -1.0], 13)),
      );

      expect(actual).toEqual(expected);
    });
  });
});
