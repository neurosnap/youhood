import { creator } from '@youhood/shared';

import { GeoJsonFeatures } from '@youhood/hood/types';

import {
  Hoods,
  HoodIds,
  HoodId,
  SetHoodNamePayload,
  HoverHoodPayload,
  EditHoodPayload,
  HoodUIPropsMap,
  HoodPropsMap,
  SetHoodUIPropsMap,
  PolygonLeaflet,
  ReplaceHoodId,
} from './types';

export const clearHoodsOnPoint = creator('CLEAR_HOODS_ON_POINT');
export const deselectHood = creator('DESELECT_HOOD');
export const selectHood = creator<HoodId>('SELECT_HOOD');
export const setHoodName = creator<SetHoodNamePayload>('SET_HOOD_NAME');
export const setHoodsOnPoint = creator<HoodIds>('SET_HOODS_ON_POINT');
export const toggleHoodSelected = creator<HoodId>('TOGGLE_HOOD_SELECTED');
export const setHoods = creator<Hoods>('SET_HOODS');
export const addHoods = creator<Hoods>('ADD_HOODS');
export const hoverHood = creator<HoverHoodPayload>('HOVER_HOOD');
export const userAddHoods = creator<Hoods>('USER_ADD_HOODS');
export const editHood = creator<EditHoodPayload>('EDIT_HOOD');
export const saveHood = creator<HoodId>('SAVE_HOOD');
export const afterSaveHood = creator<Hoods>('AFTER_SAVE_HOOD');
export const drawHood = creator('DRAW_HOOD');
export const cancelDrawHood = creator('CANCEL_DRAW_HOOD');
export const showAllHoods = creator('SHOW_ALL_HOODS');
export const hideAllHoods = creator('HIDE_ALL_HOODS');
export const hideHoods = creator<HoodIds>('HIDE_HOODS');
export const showHoods = creator<HoodIds>('SHOW_HOODS');
export const showOnlyWinnerHoods = creator('SHOW_ONLY_WINNER_HOODS');
export const addHoodUIProps = creator<HoodUIPropsMap>('ADD_HOOD_UI_PROPS');
export const setHoodUIProps = creator<SetHoodUIPropsMap>('SET_HOOD_UI_PROPS');
export const addHoodProps = creator<HoodPropsMap>('ADD_HOOD_PROPS');
export const setEdit = creator<boolean>('SET_EDIT');
export const hoodCreated = creator<PolygonLeaflet>('HOOD_CREATED');
export const replaceHoodId = creator<ReplaceHoodId>('REPLACE_HOOD_ID');
export const addHoodsAndProps = creator<GeoJsonFeatures>('ADD_HOODS_AND_PROPS');
