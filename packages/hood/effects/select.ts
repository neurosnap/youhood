import { put, call, select } from 'redux-saga/effects';

import { HoodMap } from '@youhood/map/types';
import { actions } from '@youhood/menu';
const { showMenu, hideMenu } = actions;
import { actions as userActions, transforms } from '@youhood/user';
const { addUsers } = userActions;
const { transformUser } = transforms;
import apiFetch from '@youhood/fetch';

import styleFn from '../style';
import { getHoodSelected, getHoodIdSelected } from '../selectors';
import { applyStyle } from '../utils';
import {
  HoodSelectedAction,
  PolygonLeaflet,
  ToggleHoodSelectedAction,
} from '../types';
import { deselectHood, selectHood } from '../actions';

export function onDeselectHood({ hoodGeoJSON }: HoodMap) {
  hoodGeoJSON.eachLayer((hood) => {
    (hood as PolygonLeaflet).setStyle(styleFn({ selected: false }));
  });
}

export function* onSelectHood(hoodMap: HoodMap, action: HoodSelectedAction) {
  const hoodId = action.payload;
  const style = { selected: true };
  yield call(onDeselectHood, hoodMap);
  yield call(applyStyle, { hoodMap, hoodId, style });
  yield put(showMenu('overlay'));

  const hood = yield select(getHoodSelected);
  const userId = hood.userId;
  const userResp = yield call(apiFetch, `/user/${userId}`);
  if (userResp.status !== 200) {
    return;
  }

  const rawUser = userResp.body;
  const user = transformUser(rawUser.user);
  if (!user) return;
  yield put(addUsers({ [user.id]: user }));
}

export function* toggleHoodSelected(
  hoodMap: HoodMap,
  action: ToggleHoodSelectedAction,
) {
  const hoodId = action.payload;
  const hoodIdSelected = yield select(getHoodIdSelected);

  yield put(deselectHood());

  if (hoodId === hoodIdSelected) {
    yield put(hideMenu('overlay'));
    return;
  }

  yield put(selectHood(hoodId));
}
