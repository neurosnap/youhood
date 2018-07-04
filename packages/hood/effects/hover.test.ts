import { genTester, skip } from 'gen-tester';
import { call } from 'redux-saga/effects';

import { onHoverHood } from './hover';
import { applyStyle } from '../utils';

describe('onHoverHood', () => {
  describe('if payload has the same hoodId as the one selected', () => {
    it('should return early', () => {
      const tester = genTester(onHoverHood, null, { payload: { hoodId: '123' } });
      const { actual, expected } = tester(
        skip('123'),
      );

      expect(actual).toEqual(expected);
    });
  });

  describe('when payload hoodId is different', () => {
    it('should call applyStyle', () => {
      const style = { hover: true };
      const tester = genTester(onHoverHood, null, { payload: { hoodId: '123', hover: style.hover } });
      const { actual, expected } = tester(
        skip('321'),
        call(applyStyle, { hoodMap: null, hoodId: '123', style }),
      );

      expect(actual).toEqual(expected);
    });
  });
});
