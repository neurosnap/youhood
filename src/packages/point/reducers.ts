import { Points } from '../../types';

import { ADD_POINTS } from './action-types';
import { AddPointsAction } from './action-creators';
import * as selectors from './selectors';

const points = (state: Points = [], action: AddPointsAction) => {
  switch (action.type) {
  case ADD_POINTS: {
    const points = action.payload;
    if (points.length === 0) return state;
    return [...state, ...points];
  }
  default:
    return state;
  }
};

export default {
  [selectors.points]: points,
};
