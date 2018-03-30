import { Hood, Hoods, HoodId, HoodIds, HoodHash, HoodPropsMap, HoodProperties } from './types';

export const hoodSelected = 'selected';
export const hoodsOnPoint = 'hoodsOnPoint';
export const hoods = 'hoods';
export const hoodProps = 'hoodProps';
export const editing = 'editing';

type State = any;
export const getHoods = (state: State): HoodHash => state[hoods];
export const getHoodIdSelected = (state: State): HoodId => state[hoodSelected];
export const getHoodSelected = (state: State): Hood => {
  const hoods = getHoods(state);
  const hoodId = getHoodIdSelected(state);
  return hoods[hoodId];
};
export const getHoodIdsOnPoint = (state: State): HoodIds => state[hoodsOnPoint];
export const getHoodsOnPoint = (state: State): Hoods => {
  const hoods = getHoods(state);
  return getHoodIdsOnPoint(state)
    .map((hoodId: HoodId) => hoods[hoodId]);
};
export const getHoodById = (state: State, { id }: { id: HoodId }): Hood => getHoods(state)[id];
export const getHoodsByIds = (state: State, { ids = [] }: { ids: HoodIds }): Hoods => 
  ids.map((id) => getHoods(state)[id]);
export const getHoodProps = (state: State) => state[hoodProps] || {};
export const getHoodPropsByIds = (state: State, { ids = [] }: { ids: HoodIds }): HoodPropsMap => {
  const hoodProps: HoodPropsMap = getHoodProps(state);
  return Object
    .values(hoodProps)
    .reduce((acc, hood: HoodProperties) => {
      if (ids.indexOf(hood.id) === -1) {
        return acc;
      }

      return { ...acc, [hood.id]: hood };
    }, {});
};
export const getVisibleHoodsOnPoint = (state: State) => {
  const hop = getHoodIdsOnPoint(state);
  const hoodProps: HoodPropsMap = getHoodProps(state);
  return hop
    .filter((hoodId) => hoodProps[hoodId] && hoodProps[hoodId].visible === true);
};
export const getIsEditing = (state: State) => state[editing];
