import { Point, Points } from '@youhood/point/types';

type State = any;
export const points = 'points';

export const getPoints = (state: State): Points => state[points];
export const getTotalPoints = (state: State): number => 
  getPoints(state)
    .reduce((acc: number, point: Point) => acc + point.value, 0);
