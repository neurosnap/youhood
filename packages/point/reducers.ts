import { Points } from '@youhood/point/types';

import { addPoints, resetPoints } from './actions';
import { AddPointsAction } from './types';
import * as selectors from './selectors';

const defaultState: Points = [];
const points = (state: Points = defaultState, action: AddPointsAction) => {
  switch (action.type) {
    case `${addPoints}`: {
      const points = action.payload;
      if (points.length === 0) return state;
      return [...state, ...points];
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
