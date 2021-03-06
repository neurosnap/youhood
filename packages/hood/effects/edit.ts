import { put, call } from 'redux-saga/effects';

import { HoodMap } from '@youhood/map/types';

import { setEdit } from '../actions';
import { findHood } from '../utils';
import { EditHoodAction } from '../types';

export function* onEditHood({ hoodGeoJSON }: HoodMap, action: EditHoodAction) {
  const { hoodId, edit } = action.payload;
  const hood = yield call(<any>findHood, hoodGeoJSON, hoodId);
  if (!hood) return;

  hood.options.editing || (hood.options.editing = {});
  if (edit) {
    yield put(setEdit(true));
    hood.editing.enable();
  } else {
    yield put(setEdit(false));
    hood.editing.disable();
  }
}
