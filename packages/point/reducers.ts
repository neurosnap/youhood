import { Point, Points, RemovePointsAction } from '@youhood/point/types';
import { HoodId } from '@youhood/hood/types';

import { addPoints, resetPoints, removePoints } from './actions';
import { AddPointsAction } from './types';
import * as selectors from './selectors';

const defaultState: Points = [];
const points = (
  state: Points = defaultState,
  action: AddPointsAction | RemovePointsAction,
) => {
  switch (action.type) {
    case `${addPoints}`: {
      const points = <Points>action.payload;
      if (points.length === 0) return state;
      return [...state, ...points];
    }
    case `${removePoints}`: {
      const hoodId = <HoodId>action.payload;
      const nextState: Points = [];
      state.forEach((point: Point) => {
        if (point.hoodId === hoodId) {
          return;
        }
        nextState.push(point);
      });

      return nextState;
    }
    case `${resetPoints}`:
      return defaultState;
    default:
      return state;
  }
};

export default {
  [selectors.points]: points,
};
