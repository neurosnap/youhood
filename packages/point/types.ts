import { UserId } from '@youhood/user/types';

export interface Point {
  value: number;
  reason: string;
}
export type Points = Point[];

export interface AddPointsAction {
  type: string;
  payload: Points;
}

export interface FetchPointsByUserAction {
  type: string;
  payload: UserId;
}

export interface PointMap {
  [key: string]: number;
}
