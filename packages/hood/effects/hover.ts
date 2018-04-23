import { call, select } from 'redux-saga/effects';

import { HoodMap } from '@youhood/map/types';
import { HoverHoodAction } from '../types';
import { getHoodIdSelected } from '../selectors';
import { applyStyle } from '../utils';

export function* onHoverHood(hoodMap: HoodMap, action: HoverHoodAction) {
  const { hoodId, hover } = action.payload;
  const style = { hover };
  const hoodIdSelected = yield select(getHoodIdSelected);
  if (hoodId === hoodIdSelected) {
    return;
  }
  yield call(applyStyle, { hoodMap, hoodId, style });
}
