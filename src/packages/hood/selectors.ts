import { State, Hood, Hoods } from '../../types';

export const hoodSelected = 'selected';
export const hoodsOnPoint = 'hoodsOnPoint';
export const hoods = 'hoods';

export const getHoodSelected = (state: State): Hood => state[hoodSelected];
export const getHoodsOnPoint = (state: State): Hoods => state[hoodsOnPoint];
export const getHoods = (state: State): Hoods => state[hoods];
