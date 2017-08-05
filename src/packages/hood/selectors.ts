/* @flow */
import type { State, Polygon, Polygons } from '../../types';

export const hoodSelected = 'selected';
export const hoodsOnPoint = 'hoodsOnPoint';
export const hoods = 'hoods';

export const getHoodSelected = (state: State): ?Polygon => state[hoodSelected];
export const getHoodsOnPoint = (state: State): Polygons => state[hoodsOnPoint];
export const getHoods = (state: State): Polygons => state[hoods];
