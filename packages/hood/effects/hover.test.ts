import * as expectGen from 'expect-gen';
import { call } from 'redux-saga/effects';

import { onHoverHood } from './hover';
import { applyStyle } from '../utils';

describe('onHoverHood', () => {
  describe('if payload has the same hoodId as the one selected', () => {
    it('should return early', () => {
      expectGen(onHoverHood, null, { payload: { hoodId: '123' } })
        .next('123') // getHoodIdSelected
        .finishes()
        .run();
    });
  });

  describe('when payload hoodId is different', () => {
    it('should call applyStyle', () => {
      const style = { hover: true };
      expectGen(onHoverHood, null, { payload: { hoodId: '123', hover: style.hover } })
        .next('321')
        .yields(call(applyStyle, { hoodMap: null, hoodId: '123', style }))
        .finishes()
        .run();
    });
  });
});
