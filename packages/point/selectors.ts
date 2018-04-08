import { Point, Points } from '@youhood/point/types';
import { HoodId } from '@youhood/hood/types';

type State = any;
export const points = 'points';

export const getPoints = (state: State): Points => state[points];
export const getTotalPoints = (state: State): number => 
  getPoints(state)
    .reduce((acc: number, point: Point) => acc + point.value, 0);

export const findDuplicatePoint = (state: State, { hoodId, reason }: { hoodId: HoodId, reason: string }) => {
  const points = getPoints(state);
  return points.findIndex(
    (point) => point.hoodId === hoodId && point.reason === reason,
  );
};
