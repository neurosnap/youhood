import { State, Hood, Hoods, HoodId, HoodIds } from '../../types';

export const hoodSelected = 'selected';
export const hoodsOnPoint = 'hoodsOnPoint';
export const hoods = 'hoods';

export const getHoodIdSelected = (state: State): HoodId => state[hoodSelected];
export const getHoodSelected = (state: State): Hood => {
  const hoods = getHoods(state);
  return hoods[getHoodIdSelected(state)];
};
export const getHoodIdsOnPoint = (state: State): Hoods => state[hoodsOnPoint];
export const getHoodsOnPoint = (state: State): Hood => {
  const hoods = getHoods(state);
  return hoods[getHoodIdsOnPoint(state)];
};
export const getHoods = (state: State): Hoods => state[hoods];
