import { Menus } from '../../types';

import {
  SHOW_MENU,
  HIDE_MENU,
} from './action-types';
import { MenuAction } from './action-creators';
import * as selectors from './selectors';

const defaultMenus = {
  overlay: false,
};

export const menus = (state: Menus = defaultMenus, action: MenuAction) => {
  switch (action.type) {
  case SHOW_MENU:
    if (!state.hasOwnProperty(action.payload)) {
      return state;
    }

    return { ...state, [action.payload]: true };
  case HIDE_MENU:
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
