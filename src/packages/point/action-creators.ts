import { Points } from '../../types';

import { creator } from '../shared';
import * as types from './action-types';

export interface AddPointsAction {
  type: string;
  payload: Points;
}

export const addPoints = creator<Points>(types.ADD_POINTS);
export const resetPoints = () => ({ type: types.RESET_POINTS });
