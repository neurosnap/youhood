import { Hood, Hoods, HoodIds } from '../../types';

import { getHoodId, setHoodName } from './utils';
import {
  SELECT_HOOD,
  DESELECT_HOOD,
  TOGGLE_HOOD_SELECTED,
  SET_HOODS_ON_POINT,
  CLEAR_HOODS_ON_POINT,
} from './action-types';
import {
  HoodSelectedAction,
  HopAction,
} from './action-creators';
import * as selectors from './selectors';

export const hoodSelected = (state: Hood = null, action: HoodSelectedAction): Hood => {
  switch (action.type) {
  case SELECT_HOOD:
    return action.payload;

  case DESELECT_HOOD:
    return null;

  case TOGGLE_HOOD_SELECTED: {
    const hoodId = action.payload;

    if (hoodId === state) {
      return null;
    }

    return hoodId;
  }

  default:
    return state;
  }
};

const defaultHop: HoodIds = [];
export const hoodsOnPoint = (state: HoodIds = defaultHop, action: HopAction): HoodIds => {
  switch (action.type) {
  case SET_HOODS_ON_POINT:
    return action.payload;
  case CLEAR_HOODS_ON_POINT:
    return defaultHop;
  default:
    return state;
  }
};

const findHoodIndex = (state: Hoods, hoodId: string) =>
  state.findIndex((hood) => getHoodId(hood) === hoodId);

export default {
  [selectors.hoodSelected]: hoodSelected,
  [selectors.hoodsOnPoint]: hoodsOnPoint,
};
