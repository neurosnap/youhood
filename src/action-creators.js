/* @flow */
import * as types from './action-types';

type ActionType = string;
type ActionPayload = any;
type Action = {
  type: ActionType,
  payload: ActionPayload,
};

const creator = (type: ActionType) =>
  (payload: ActionPayload): Action => ({
    type,
    payload,
  });

export const addHoods = creator(types.ADD_HOODS);
export const clearHoodsOnPoint = creator(types.CLEAR_HOODS_ON_POINT);
export const deselectHood = creator(types.DESELECT_HOOD);
export const hideMenu = creator(types.HIDE_MENU);
export const selectHood = creator(types.SELECT_HOOD);
export const setHoodName = creator(types.SET_HOOD_NAME);
export const setHoodsOnPoint = creator(types.SET_HOODS_ON_POINT);
export const setHoods = creator(types.SET_HOODS);
export const showMenu = creator(types.SHOW_MENU);
export const toggleHoodSelected = creator(types.TOGGLE_HOOD_SELECTED);
