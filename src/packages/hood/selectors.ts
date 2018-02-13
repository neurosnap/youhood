import { Hood, Hoods, HoodId, HoodIds, HoodHash } from './types';

export const hoodSelected = 'selected';
export const hoodsOnPoint = 'hoodsOnPoint';
export const hoods = 'hoods';

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
