/* @flow */
import { combineReducers } from 'redux';

import type { Polygon, HoodIds } from './types';
import { getHoodId, setHoodName } from './hood';
import {
  SELECT_HOOD,
  DESELECT_HOOD,
  TOGGLE_HOOD_SELECTED,
  SET_HOODS_ON_POINT,
  CLEAR_HOODS_ON_POINT,
  SET_HOODS,
  ADD_HOODS,
  SET_HOOD_NAME,
  SHOW_MENU,
  HIDE_MENU,
} from './action-types';

const hoodSelected = (state: ?Polygon = null, action) => {
  switch (action.type) {
  case SELECT_HOOD:
    return action.payload;

  case DESELECT_HOOD:
    return null;

  case TOGGLE_HOOD_SELECTED: {
    const hood = action.payload;

    if (getHoodId(hood) === getHoodId(state)) {
      return null;
    }

    return hood;
  }

  default:
    return state;
  }
};

const defaultHop = [];
const hoodsOnPoint = (state: HoodIds = defaultHop, action) => {
  switch (action.type) {
  case SET_HOODS_ON_POINT:
    return action.payload;
  case CLEAR_HOODS_ON_POINT:
    return defaultHop;
  default:
    return state;
  }
};

const findHoodIndex = (state, hoodId) => state.findIndex((hood) => getHoodId(hood) === hoodId);

const hoods = (state = [], action) => {
  switch (action.type) {
  case SET_HOODS:
    return action.payload;

  case ADD_HOODS:
    if (!action.payload || action.payload.length === 0) return state;
    return [...state, ...action.payload];

  case SET_HOOD_NAME: {
    const { hoodId, name } = action.payload;
    const hoodIndex = findHoodIndex(state, hoodId);
    if (hoodIndex === -1) return state;

    const nextState = [...state];
    nextState[hoodIndex] = { ...nextState[hoodIndex] };
    setHoodName(nextState[hoodIndex], name);
    return nextState;
  }

  default:
    return state;
  }
};

const defaultMenus = {
  overlay: false,
};

const menus = (state = defaultMenus, action) => {
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

export default combineReducers({
  selected: hoodSelected,
  hoodsOnPoint,
  polygons: hoods,
  menus,
});
