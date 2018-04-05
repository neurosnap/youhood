import { getHoodId, getHoodProps } from './utils';
import {
  SELECT_HOOD,
  DESELECT_HOOD,
  SET_HOODS_ON_POINT,
  CLEAR_HOODS_ON_POINT,
  ADD_HOODS,
  USER_ADD_HOODS,
  ADD_HOOD_UI_PROPS,
  SET_EDIT,
  SET_HOOD_NAME,
  ADD_HOOD_PROPS,
  SET_HOOD_UI_PROPS,
} from './action-types';
import {
  HoodSelectedAction,
  HopAction,
  SetHoodsAction,
  SetHoodNameAction,
  SetHoodNamePayload,
  HoodPropsMap,
  Hood,
  Hoods,
  HoodId,
  HoodIds,
  HoodUIPropsMap,
  AddHoodUIPropsAction,
  SetEdit,
  AddHoodPropsAction,
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
const hoodUIProps = (state: HoodUIPropsMap = defaultHoodProps, action: AddHoodUIPropsAction): HoodUIPropsMap => {
  switch (action.type) {
  case ADD_HOOD_UI_PROPS: {
    const propMap = action.payload;
    return { ...state, ...propMap };
  }
  case SET_HOOD_UI_PROPS: {
    const props = action.payload;
    if (Object.keys(props).length === 0) {
      return state;
    }

    const newState = { ...state };
    Object.keys(newState).forEach(
      (hoodId) => {
        newState[hoodId] = { ...newState[hoodId], ...props[hoodId] };
      },
    );

    return newState;
  }
  default:
    return state;
  }
};

type HoodObj = HoodPropsMap;

function arrayToObj(arr: Hoods, init: HoodObj = {}): HoodObj {
  return arr.reduce((acc: HoodObj, hood: Hood) => {
    const hoodId = getHoodId(hood);
    const props = getHoodProps(hood);
    return { ...acc, [hoodId]: props };
  }, init);
}

const hoodProps = (state: HoodObj = {}, action: AddHoodPropsAction | SetHoodsAction | SetHoodNameAction): HoodObj => {
  switch (action.type) {
  case ADD_HOOD_PROPS: {
    const propMap = <HoodObj>action.payload;
    return { ...state, ...propMap };
  }

  case USER_ADD_HOODS:
  case ADD_HOODS: {
    const hoodPayload = <Hoods>action.payload;
    if (!hoodPayload || hoodPayload.length === 0) {
      return state;
    }
    return arrayToObj(hoodPayload, state);
  }

  case SET_HOOD_NAME: {
    const { hoodId, name } = <SetHoodNamePayload>action.payload;
    const nextState = { ...state };
    nextState[hoodId] = { ...nextState[hoodId] };
    nextState[hoodId].name = name;
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
  [selectors.hoodProps]: hoodProps,
  [selectors.hoodUIProps]: hoodUIProps,
  [selectors.editing]: editing,
};
