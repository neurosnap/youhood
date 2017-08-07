import { Hood, Hoods, HoodIds } from '../../types';
import { creator } from '../shared';
import * as types from './action-types';

type ActionType = string;

export interface HoodSelectedAction {
  type: ActionType;
  payload: Hood;
}

export interface HoodsAction {
  type: ActionType;
  payload: Hoods;
}

export interface HopAction {
  type: ActionType;
  payload: HoodIds;
}

export interface SetHoodNamePayload {
  hoodId: string;
  name: string;
}
export interface SetHoodNameAction {
  type: ActionType;
  payload: SetHoodNamePayload;
}

export const addHoods = creator<Hoods>(types.ADD_HOODS);
export const clearHoodsOnPoint = creator(types.CLEAR_HOODS_ON_POINT);
export const deselectHood = creator<Hood>(types.DESELECT_HOOD);
export const selectHood = creator<Hood>(types.SELECT_HOOD);
export const setHoodName = creator<SetHoodNamePayload>(types.SET_HOOD_NAME);
export const setHoodsOnPoint = creator<Hoods>(types.SET_HOODS_ON_POINT);
export const setHoods = creator<Hoods>(types.SET_HOODS);
export const toggleHoodSelected = creator<Hood>(types.TOGGLE_HOOD_SELECTED);
