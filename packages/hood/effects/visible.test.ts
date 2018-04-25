import { call, put } from 'redux-saga/effects';

import * as expectGen from 'expect-gen';

import {
  setHoodDisplay,
  onHideAllHoods,
  onShowAllHoods,
  onShowHoods,
  onHideHoods,
} from './visible';
import { setHoodUIProps } from '../action-creators';
import { mockHoodMap } from '../mock';

const hoodMap = mockHoodMap({ onlyGeoJSON: true });

describe('onHideAllHoods', () => {
  it('should run all tasks', () => {
    const hoodIds = ['1', '2'];

    expectGen(onHideAllHoods, hoodMap)
      .next(hoodIds) // getHoodUIPropsAsIds
      .yields(put(setHoodUIProps({
        1: { visible: false },
        2: { visible: false },
      })))
      .yields(call(setHoodDisplay, {
        hoodGeoJSON: hoodMap.hoodGeoJSON,
        hoodIds,
        display: 'none',
      }))
      .finishes()
      .run();
  });
});

describe('onShowAllHoods', () => {
  it('should run all tasks', () => {
    const hoodIds = ['1', '2'];

    expectGen(onShowAllHoods, hoodMap)
      .next(hoodIds) // getHoodUIPropsAsIds
      .yields(put(setHoodUIProps({
        1: { visible: true },
        2: { visible: true },
      })))
      .yields(call(setHoodDisplay, {
        hoodGeoJSON: hoodMap.hoodGeoJSON,
        hoodIds,
        display: 'block',
      }))
      .finishes()
      .run();
  });
});

describe('onShowHoods', () => {
  it('should run all tasks', () => {
    const hoodIds = ['1', '2'];

    expectGen(onShowHoods, hoodMap, { payload: hoodIds })
      .yields(put(setHoodUIProps({
        1: { visible: true },
        2: { visible: true },
      })))
      .yields(call(setHoodDisplay, {
        hoodGeoJSON: hoodMap.hoodGeoJSON,
        hoodIds,
        display: 'block',
      }))
      .finishes()
      .run();
  });
});

describe('onHideHoods', () => {
  it('should run all tasks', () => {
    const hoodIds = ['1', '2'];

    expectGen(onHideHoods, hoodMap, { payload: hoodIds })
      .yields(put(setHoodUIProps({
        1: { visible: false },
        2: { visible: false },
      })))
      .yields(call(setHoodDisplay, {
        hoodGeoJSON: hoodMap.hoodGeoJSON,
        hoodIds,
        display: 'none',
      }))
      .finishes()
      .run();
  });
});
