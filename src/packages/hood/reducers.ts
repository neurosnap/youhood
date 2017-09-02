import { Hood, Hoods, HoodId, HoodIds } from '../../types';

import { getHoodId, setHoodName } from './utils';
import {
  SELECT_HOOD,
  DESELECT_HOOD,
  SET_HOODS_ON_POINT,
  CLEAR_HOODS_ON_POINT,
  ADD_HOODS,
  SET_HOODS,
  SET_HOOD_NAME,
} from './action-types';
import {
  HoodSelectedAction,
  HopAction,
  SetHoodsAction,
  SetHoodNameAction,
  SetHoodNamePayload,
} from './action-creators';
import * as selectors from './selectors';

export const hoodSelected = (state: HoodId = null, action: HoodSelectedAction): HoodId => {
  switch (action.type) {
  case SELECT_HOOD:
    return action.payload;

  case DESELECT_HOOD:
    return null;

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

type HoodObj = { [key: string]: Hood };

function arrayToObj(arr: Hoods, init: HoodObj = {}): HoodObj {
  return arr.reduce((acc: HoodObj, hood: Hood) => {
    const hoodId = getHoodId(hood);
    return { ...acc, [hoodId]: hood };
  }, init);
}

export const hoods = (state: HoodObj = {}, action: SetHoodsAction | SetHoodNameAction): HoodObj => {
  switch (action.type) {
  case SET_HOODS:
    return arrayToObj(<Hoods>action.payload);

  case ADD_HOODS: {
    const hoodPayload = <Hoods>action.payload;
    if (!hoodPayload || hoodPayload.length === 0) return state;
    return arrayToObj(hoodPayload, state);
  }

  case SET_HOOD_NAME: {
    const { hoodId, name } = <SetHoodNamePayload>action.payload;

    const nextState = { ...state };
    nextState[hoodId] = { ...nextState[hoodId] };
    setHoodName(nextState[hoodId], name);
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
