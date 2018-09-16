import { getHoodId, getHoodProps } from './utils';
import {
  selectHood,
  deselectHood,
  setHoodsOnPoint,
  clearHoodsOnPoint,
  addHoods,
  userAddHoods,
  addHoodUIProps,
  setEdit,
  setHoodName,
  addHoodProps,
  setHoodUIProps,
  replaceHoodId,
} from './actions';
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
  ReplaceHoodIdAction,
} from './types';
import * as selectors from './selectors';

const hoodSelected = (
  state: HoodId = null,
  action: HoodSelectedAction,
): HoodId => {
  switch (action.type) {
    case `${selectHood}`:
      return action.payload;

    case `${deselectHood}`:
      return null;

    default:
      return state;
  }
};

const defaultHop: HoodIds = [];
const hoodsOnPoint = (
  state: HoodIds = defaultHop,
  action: HopAction,
): HoodIds => {
  switch (action.type) {
    case `${setHoodsOnPoint}`:
      return action.payload;
    case `${clearHoodsOnPoint}`:
      return defaultHop;
    default:
      return state;
  }
};

const defaultHoodProps = {};
const hoodUIProps = (
  state: HoodUIPropsMap = defaultHoodProps,
  action: AddHoodUIPropsAction | ReplaceHoodIdAction,
): HoodUIPropsMap => {
  switch (action.type) {
    case `${addHoodUIProps}`: {
      const propMap = <HoodUIPropsMap>action.payload;
      return { ...state, ...propMap };
    }
    case `${setHoodUIProps}`: {
      const props = <HoodUIPropsMap>action.payload;
      if (Object.keys(props).length === 0) {
        return state;
      }

      const newState = { ...state };
      Object.keys(newState).forEach((hoodId) => {
        newState[hoodId] = { ...newState[hoodId], ...props[hoodId] };
      });

      return newState;
    }
    case `${replaceHoodId}`:
      return replaceHoodIdReducer(state, <ReplaceHoodIdAction>action);
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

function replaceHoodIdReducer(
  state: { [key: string]: any },
  action: ReplaceHoodIdAction,
) {
  const { hoodId, prevHoodId } = action.payload;
  const newState = { ...state };
  newState[hoodId] = newState[prevHoodId];
  delete newState[prevHoodId];
  return newState;
}

const hoodProps = (
  state: HoodObj = {},
  action:
    | AddHoodPropsAction
    | SetHoodsAction
    | SetHoodNameAction
    | ReplaceHoodIdAction,
): HoodObj => {
  switch (action.type) {
    case `${addHoodProps}`: {
      const propMap = <HoodObj>action.payload;
      return { ...state, ...propMap };
    }

    case `${userAddHoods}`:
    case `${addHoods}`: {
      const hoodPayload = <Hoods>action.payload;
      if (!hoodPayload || hoodPayload.length === 0) {
        return state;
      }
      return arrayToObj(hoodPayload, state);
    }

    case `${setHoodName}`: {
      const { hoodId, name } = <SetHoodNamePayload>action.payload;
      const nextState = { ...state };
      nextState[hoodId] = { ...nextState[hoodId] };
      nextState[hoodId].name = name;
      return nextState;
    }

    case `${replaceHoodId}`:
      return replaceHoodIdReducer(state, <ReplaceHoodIdAction>action);

    default:
      return state;
  }
};

const editing = (state: boolean = false, action: SetEdit): boolean => {
  switch (action.type) {
    case `${setEdit}`:
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
