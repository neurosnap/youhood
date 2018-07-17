import { creator } from '@youhood/shared';

export type MenuPayload = string;
export interface MenuAction {
  type: string;
  payload: MenuPayload;
}

export const hideMenu = creator<MenuPayload>('HIDE_MENU');
export const showMenu = creator<MenuPayload>('SHOW_MENU');
