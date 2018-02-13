import { Hoods, HoodIds, HoodId } from '../../types';
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

export interface SetHoodsAction {
  type: ActionType;
  payload: Hoods;
}

export interface HoverHoodPayload {
  hoodId: HoodId;
  hover: boolean;
}

export interface HoverHoodAction {
  type: ActionType;
  payload: HoverHoodPayload;
}

export interface EditHoodPayload {
  hoodId: HoodId;
  edit: boolean;
}

export interface EditHoodAction {
  type: string;
  payload: EditHoodPayload;
}

export interface SaveHoodAction {
  type: string;
  payload: HoodId;
}

export const clearHoodsOnPoint = () => ({ type: types.CLEAR_HOODS_ON_POINT });
export const deselectHood = () => ({ type: types.DESELECT_HOOD });
export const selectHood = creator<HoodId>(types.SELECT_HOOD);
export const setHoodName = creator<SetHoodNamePayload>(types.SET_HOOD_NAME);
export const setHoodsOnPoint = creator<HoodIds>(types.SET_HOODS_ON_POINT);
export const toggleHoodSelected = creator<HoodId>(types.TOGGLE_HOOD_SELECTED);
export const setHoods = creator<Hoods>(types.SET_HOODS);
export const addHoods = creator<Hoods>(types.ADD_HOODS);
export const hoverHood = creator<HoverHoodPayload>(types.HOVER_HOOD);
export const userAddHoods = creator<Hoods>(types.USER_ADD_HOODS);
export const editHood = creator<EditHoodPayload>(types.EDIT_HOOD);
export const saveHood = creator<HoodId>(types.SAVE_HOOD);
export const afterSaveHood = creator<Hoods>(types.AFTER_SAVE_HOOD);
export const drawHood = () => ({ type: types.DRAW_HOOD });
