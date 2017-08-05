import { Hood, Hoods, HoodIds } from '../../types';

import { getHoodId, setHoodName } from './utils';
import {
  SELECT_HOOD,
  DESELECT_HOOD,
  TOGGLE_HOOD_SELECTED,
  SET_HOODS_ON_POINT,
  CLEAR_HOODS_ON_POINT,
  SET_HOODS,
  ADD_HOODS,
  SET_HOOD_NAME,
} from './action-types';
import {
  HoodSelectedAction,
  HoodsAction,
  SetHoodNameAction,
  SetHoodNamePayload,
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

export const hoods = (state: Hoods = [], action: HoodsAction | SetHoodNameAction) => {
  switch (action.type) {
  case SET_HOODS:
    return action.payload;

  case ADD_HOODS: {
    const hoods = <Hoods>action.payload;
    if (!hoods || hoods.length === 0) return state;
    return [...state, ...hoods];
  }

  case SET_HOOD_NAME: {
    const { hoodId, name } = <SetHoodNamePayload>action.payload;
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

export default {
  [selectors.hoodSelected]: hoodSelected,
  [selectors.hoodsOnPoint]: hoodsOnPoint,
  [selectors.hoods]: hoods,
};
