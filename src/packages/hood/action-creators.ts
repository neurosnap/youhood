import { Hood, Hoods, HoodIds, HoodId } from '../../types';
import { creator } from '../shared';
import * as types from './action-types';

type ActionType = string;

export interface HoodSelectedAction {
  type: ActionType;
  payload: HoodId;
}

export interface HopAction {
  type: ActionType;
  payload: HoodIds;
}

export interface SetHoodNamePayload {
  hoodId: HoodId;
  name: string;
}

export interface SetHoodNameAction {
  type: ActionType;
  payload: SetHoodNamePayload;
}

export interface ToggleHoodSelectedAction {
  type: ActionType;
  payload: HoodId;
}

export const clearHoodsOnPoint = creator(types.CLEAR_HOODS_ON_POINT);
export const deselectHood = creator<Hood>(types.DESELECT_HOOD);
export const selectHood = creator<Hood>(types.SELECT_HOOD);
export const setHoodName = creator<SetHoodNamePayload>(types.SET_HOOD_NAME);
export const setHoodsOnPoint = creator<Hoods>(types.SET_HOODS_ON_POINT);
export const toggleHoodSelected = creator<Hood>(types.TOGGLE_HOOD_SELECTED);
