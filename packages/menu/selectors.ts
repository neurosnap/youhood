import { Menus } from '@youhood/menu/types';

type State = any;
export const menus = 'menus';

export const getMenus = (state: State): Menus => state[menus];
export const isOverlayOpen = (state: State): boolean => getMenus(state).overlay;
