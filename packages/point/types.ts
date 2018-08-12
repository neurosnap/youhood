import { UserId } from '@youhood/user/types';
import { HoodId } from '@youhood/hood/types';

export interface Point {
  value: number;
  reason: string;
  hoodId: HoodId;
}
export type Points = Point[];

export interface AddPointsAction {
  type: string;
  payload: Points;
}

export interface RemovePointsAction {
  type: string;
  payload: HoodId;
}

export interface FetchPointsByUserAction {
  type: string;
  payload: UserId;
}

export interface PointMap {
  [key: string]: number;
}
