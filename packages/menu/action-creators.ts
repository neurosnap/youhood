import { creator } from '@youhood/shared';

import * as types from './action-types';

export   type MenuPayload = string;
export interface MenuAction {
  type: string;
  payload: MenuPayload;
}

export const hideMenu = creator<MenuPayload>(types.HIDE_MENU);
export const showMenu = creator<MenuPayload>(types.SHOW_MENU);
