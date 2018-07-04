import { call, put } from 'redux-saga/effects';

import { genTester, skip } from 'gen-tester';

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

    const tester = genTester(onHideAllHoods, hoodMap);
    const { actual, expected } = tester(
      skip(hoodIds),
      put(
        setHoodUIProps({
          1: { visible: false },
          2: { visible: false },
        }),
      ),
      call(setHoodDisplay, {
        hoodGeoJSON: hoodMap.hoodGeoJSON,
        hoodIds,
        display: 'none',
      }),
    );

    expect(actual).toEqual(expected);
  });
});

describe('onShowAllHoods', () => {
  it('should run all tasks', () => {
    const hoodIds = ['1', '2'];

    const tester = genTester(onShowAllHoods, hoodMap);
    const { actual, expected } = tester(
      skip(hoodIds),
      put(setHoodUIProps({
        1: { visible: true },
        2: { visible: true },
      })),
      call(setHoodDisplay, {
        hoodGeoJSON: hoodMap.hoodGeoJSON,
        hoodIds,
        display: 'block',
      }),
    );

    expect(actual).toEqual(expected);
  });
});

describe('onShowHoods', () => {
  it('should run all tasks', () => {
    const hoodIds = ['1', '2'];

    const tester = genTester(onShowHoods, hoodMap, { payload: hoodIds });
    const { actual, expected } = tester(
      put(setHoodUIProps({
        1: { visible: true },
        2: { visible: true },
      })),
      call(setHoodDisplay, {
        hoodGeoJSON: hoodMap.hoodGeoJSON,
        hoodIds,
        display: 'block',
      }),
    );

    expect(actual).toEqual(expected);
  });
});

describe('onHideHoods', () => {
  it('should run all tasks', () => {
    const hoodIds = ['1', '2'];

    const tester = genTester(onHideHoods, hoodMap, { payload: hoodIds });
    const { actual, expected } = tester(
      put(setHoodUIProps({
        1: { visible: false },
        2: { visible: false },
      })),
      call(setHoodDisplay, {
        hoodGeoJSON: hoodMap.hoodGeoJSON,
        hoodIds,
        display: 'none',
      }),
    );

    expect(actual).toEqual(expected);
  });
});
