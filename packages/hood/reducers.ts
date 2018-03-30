import { getHoodId, setHoodName } from './utils';
import {
  SELECT_HOOD,
  DESELECT_HOOD,
  SET_HOODS_ON_POINT,
  CLEAR_HOODS_ON_POINT,
  ADD_HOODS,
  SET_HOODS,
  USER_ADD_HOODS,
  SET_HOOD_NAME,
  ADD_HOOD_PROPS,
  SET_EDIT,
} from './action-types';
import {
  HoodSelectedAction,
  HopAction,
  SetHoodsAction,
  SetHoodNameAction,
  SetHoodNamePayload,
  Hood,
  Hoods,
  HoodId,
  HoodIds,
  HoodPropsMap,
  AddHoodPropsMap,
  SetEdit,
} from './types';
import * as selectors from './selectors';

const hoodSelected = (state: HoodId = null, action: HoodSelectedAction): HoodId => {
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
const hoodsOnPoint = (state: HoodIds = defaultHop, action: HopAction): HoodIds => {
  switch (action.type) {
  case SET_HOODS_ON_POINT:
    return action.payload;
  case CLEAR_HOODS_ON_POINT:
    return defaultHop;
  default:
    return state;
  }
};

const defaultHoodProps = {};
const hoodProps = (state: HoodPropsMap = defaultHoodProps, action: AddHoodPropsMap): HoodPropsMap => {
  switch (action.type) {
  case ADD_HOOD_PROPS: {
    const propMap = action.payload;
    return { ...state, ...propMap };
  }
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

const hoods = (state: HoodObj = {}, action: SetHoodsAction | SetHoodNameAction): HoodObj => {
  switch (action.type) {
  case SET_HOODS:
    return arrayToObj(<Hoods>action.payload);

  case USER_ADD_HOODS:
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

const editing = (state: boolean = false, action: SetEdit): boolean => {
  switch (action.type) {
  case SET_EDIT:
    return action.payload;
  default:
    return state;
  }
};

export default {
  [selectors.hoodSelected]: hoodSelected,
  [selectors.hoodsOnPoint]: hoodsOnPoint,
  [selectors.hoods]: hoods,
  [selectors.hoodProps]: hoodProps,
  [selectors.editing]: editing,
};
