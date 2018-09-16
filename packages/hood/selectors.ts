import {
  HoodPropsList,
  HoodId,
  HoodIds,
  HoodPropsMap,
  HoodProps,
  HoodUIPropsMap,
  HoodUIProps,
} from './types';

export const hoodSelected = 'selected';
export const hoodsOnPoint = 'hoodsOnPoint';
export const hoodProps = 'hoodProps';
export const hoodUIProps = 'hoodUIProps';
export const editing = 'editing';

type State = any;
export const getHoodProps = (state: State) => state[hoodProps] || {};
export const getHoodPropsByIds = (
  state: State,
  { ids = [] }: { ids: HoodIds },
): HoodPropsMap => {
  const hoodProps: HoodPropsMap = getHoodProps(state);
  return Object.values(hoodProps).reduce((acc, hood: HoodProps) => {
    if (ids.indexOf(hood.id) === -1) {
      return acc;
    }

    return { ...acc, [hood.id]: hood };
  }, {});
};
export const getHoodPropsById = (state: State, { id = '' }: { id: HoodId }) => {
  const propsList = getHoodPropsByIds(state, { ids: [id] });
  return propsList[id];
};

export const getHoodUIProps = (state: State): HoodUIPropsMap =>
  state[hoodUIProps] || {};
export const getHoodUIPropsByIds = (
  state: State,
  { ids = [] }: { ids: HoodIds },
): HoodPropsMap => {
  const hoodProps: HoodUIPropsMap = getHoodUIProps(state);
  return Object.values(hoodProps).reduce((acc, hood: HoodUIProps) => {
    if (ids.indexOf(hood.id) === -1) {
      return acc;
    }

    return { ...acc, [hood.id]: hood };
  }, {});
};
export const getHoodUIPropsById = (
  state: State,
  { id = '' }: { id: HoodId },
) => {
  const propsList = getHoodUIPropsByIds(state, { ids: [id] });
  return propsList[id];
};
export const getHoodUIPropsAsIds = (state: State) =>
  Object.keys(getHoodUIProps(state));

export const getHoodIdSelected = (state: State): HoodId => state[hoodSelected];
export const getHoodSelected = (state: State): HoodProps => {
  const hoods = getHoodProps(state);
  const hoodId = getHoodIdSelected(state);
  return hoods[hoodId] || {};
};
export const getHoodIdsOnPoint = (state: State): HoodIds => state[hoodsOnPoint];
export const getHoodsOnPoint = (state: State): HoodPropsList => {
  const hoods = getHoodProps(state);
  return getHoodIdsOnPoint(state)
    .map((hoodId: HoodId) => hoods[hoodId])
    .filter(Boolean);
};

export const getVisibleHoodsOnPoint = (state: State) => {
  const hop = getHoodIdsOnPoint(state);
  const hoodProps = getHoodUIProps(state);
  return hop.filter(
    (hoodId) => hoodProps[hoodId] && hoodProps[hoodId].visible === true,
  );
};
export const getIsEditing = (state: State) => state[editing];
