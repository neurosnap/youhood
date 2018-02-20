import { creator } from '@youhood/shared';
import { UserId } from '@youhood/user/types';

import { Points } from './types';
import * as types from './action-types';

export const addPoints = creator<Points>(types.ADD_POINTS);
export const resetPoints = () => ({ type: types.RESET_POINTS });
export const fetchPointsByUser = creator<UserId>(types.FETCH_POINTS_BY_USER); 
