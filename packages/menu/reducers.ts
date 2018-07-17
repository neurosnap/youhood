import { Menus } from '@youhood/menu/types';

import { showMenu, hideMenu, MenuAction } from './actions';
import * as selectors from './selectors';

const defaultMenus = {
  overlay: false,
};

export const menus = (state: Menus = defaultMenus, action: MenuAction) => {
  switch (action.type) {
    case `${showMenu}`:
      if (!state.hasOwnProperty(action.payload)) {
        return state;
      }

      return { ...state, [action.payload]: true };
    case `${hideMenu}`:
      if (!state.hasOwnProperty(action.payload)) {
        return state;
      }

      return { ...state, [action.payload]: false };
    default:
      return state;
  }
};

export default {
  [selectors.menus]: menus,
};
