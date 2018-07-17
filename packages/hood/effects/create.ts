import { put, select, call } from 'redux-saga/effects';

import { HoodMap } from '@youhood/map/types';
import {
  actions as userActions,
  utils as userUtils,
  selectors,
} from '@youhood/user';
const { addUsers, setUser } = userActions;
const { createUser } = userUtils;
const { getCurrentUser } = selectors;

import {
  selectHood,
  setEdit,
  userAddHoods,
  addHoodUIProps,
  editHood,
} from '../actions';
import { getHoodId, createHood, createHoodUI } from '../utils';
import { DrawCreatedAction } from '../types';

export function* onHoodCreated(
  { hoodGeoJSON }: HoodMap,
  action: DrawCreatedAction,
) {
  const layer = action.payload;
  const hood = layer.toGeoJSON();

  yield put(setEdit(false));

  let user = yield select(getCurrentUser);
  if (!user) {
    user = yield call(createUser);
    yield put(addUsers([user]));
    yield put(setUser(user.id));
  }

  const props = yield call(createHood, { userId: user.id });
  hoodGeoJSON.addData(hood);
  hood.properties = props;
  const hoodId = getHoodId(hood);
  const uiProps = createHoodUI({ id: hoodId });
  yield put(addHoodUIProps({ [hoodId]: uiProps }));
  yield put(userAddHoods([hood]));
  yield put(selectHood(hoodId));
  yield put(editHood({ hoodId, edit: true }));
}
