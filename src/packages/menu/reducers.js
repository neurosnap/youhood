/* @flow */
import {
  SHOW_MENU,
  HIDE_MENU,
} from './action-types';

type Menus = {
  overlay: boolean,
};

const defaultMenus = {
  overlay: false,
};

export const menus = (state: Menus = defaultMenus, action: Object) => {
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
