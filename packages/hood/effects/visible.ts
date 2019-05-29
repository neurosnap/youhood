import { call, put, select } from 'redux-saga/effects';

import { HoodMap, HoodGeoJSON } from '@youhood/map/types';
import { selectors } from '@youhood/hood-winners';
const { getHoodWinners } = selectors;

import { setHoodUIProps } from '../actions';
import { getHoodUIPropsAsIds } from '../selectors';
import { getHoodId } from '../utils';
import { PolygonLeaflet, HoodId, HoodIds } from '../types';

interface HoodIdsAction {
  type: string;
  payload: HoodIds;
}

export function* onShowOnlyWinnerHoods(hoodMap: HoodMap) {
  yield call(onHideAllHoods, hoodMap);
  const hoodIds = yield select(getHoodWinners);
  const hoodUIProps = setHoodUIVisibility(hoodIds, true);
  yield put(setHoodUIProps(hoodUIProps));
  yield call(setHoodDisplay, {
    hoodGeoJSON: hoodMap.hoodGeoJSON,
    hoodIds,
    display: 'block',
  });
}

export function* onHideAllHoods({ hoodGeoJSON }: HoodMap) {
  const hoodIds = yield select(getHoodUIPropsAsIds);
  const hoodUIProps = setHoodUIVisibility(hoodIds, false);
  yield put(setHoodUIProps(hoodUIProps));
  yield call(setHoodDisplay, { hoodGeoJSON, hoodIds, display: 'none' });
}

export function* onShowAllHoods({ hoodGeoJSON }: HoodMap) {
  const hoodIds = yield select(getHoodUIPropsAsIds);
  const hoodUIProps = setHoodUIVisibility(hoodIds, true);
  yield put(setHoodUIProps(hoodUIProps));
  yield call(setHoodDisplay, { hoodGeoJSON, hoodIds, display: 'block' });
}

export function* onHideHoods({ hoodGeoJSON }: HoodMap, action: HoodIdsAction) {
  const hoodIds = action.payload;
  const hoodUIProps = setHoodUIVisibility(hoodIds, false);
  yield put(setHoodUIProps(hoodUIProps));
  yield call(setHoodDisplay, { hoodGeoJSON, hoodIds, display: 'none' });
}

export function* onShowHoods({ hoodGeoJSON }: HoodMap, action: HoodIdsAction) {
  const hoodIds = action.payload;
  const hoodUIProps = setHoodUIVisibility(hoodIds, true);
  yield put(setHoodUIProps(hoodUIProps));
  yield call(setHoodDisplay, { hoodGeoJSON, hoodIds, display: 'block' });
}

function setHoodUIVisibility(hoodIds: HoodIds, visible: boolean) {
  const init = {};
  return hoodIds.reduce(
    (acc: Object, hoodId: HoodId) => ({ ...acc, [hoodId]: { visible } }),
    init,
  );
}

interface SetHoodDisplay {
  hoodGeoJSON: HoodGeoJSON;
  hoodIds: HoodIds;
  display: string;
}

export function setHoodDisplay({
  hoodGeoJSON,
  hoodIds,
  display,
}: SetHoodDisplay) {
  hoodGeoJSON.eachLayer((hood: PolygonLeaflet) => {
    const hoodId = getHoodId(hood);

    if (hoodIds.indexOf(hoodId) === -1) {
      return;
    }

    (<HTMLElement>hood.getElement()).style.display = display;
  });
}
