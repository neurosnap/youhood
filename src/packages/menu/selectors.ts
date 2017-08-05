import { State, Menus } from '../../types';

export const menus = 'menus';

export const getMenus = (state: State): Menus => state[menus];
export const isOverlayOpen = (state: State): boolean => getMenus(state).overlay;
