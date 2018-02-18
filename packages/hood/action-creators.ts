import { creator } from '@youhood/shared';

import { 
  Hoods, 
  HoodIds, 
  HoodId,
  SetHoodNamePayload,
  HoverHoodPayload,
  EditHoodPayload,
} from './types';
import * as types from './action-types';

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
