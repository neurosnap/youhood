import { call } from 'redux-saga/effects';
import { genTester, yields } from 'gen-tester';

import apiFetch from '.';

describe('apiFetch', () => {
  describe('request was successful', () => {
    it('should finish', () => {
      const url = 'https://api.youhood.io/some/query';
      const opts = {
        auth: false,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ test: true }),
      };
      const optsNoAuth = {
        ...opts,
      };

      delete optsNoAuth.auth;

      const res = { status: 200, json: jest.fn() };
      const json = { something: 'cool' };

      const tester = genTester(apiFetch, '/some/query', opts);
      const { actual, expected } = tester(
        yields(call(fetch, url, optsNoAuth), res),
        yields(call([res, 'json']), json),
        { status: 200, body: json },
      );

      expect(actual).toEqual(expected);
    });
  });
});
