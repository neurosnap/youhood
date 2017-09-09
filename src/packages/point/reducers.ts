import { Points } from '../../types';

import { ADD_POINTS, RESET_POINTS } from './action-types';
import { AddPointsAction } from './action-creators';
import * as selectors from './selectors';

const defaultState: Points = [];
const points = (state: Points = defaultState, action: AddPointsAction) => {
  switch (action.type) {
  case ADD_POINTS: {
    const points = action.payload;
    if (points.length === 0) return state;
    return [...state, ...points];
  }
  case RESET_POINTS:
    return defaultState;
  default:
    return state;
  }
};

export default {
  [selectors.points]: points,
};
