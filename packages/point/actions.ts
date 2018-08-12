import { creator } from '@youhood/shared';
import { UserId } from '@youhood/user/types';
import { HoodId } from '@youhood/hood/types';

import { Points } from './types';

export const addPoints = creator<Points>('ADD_POINTS');
export const removePoints = creator<HoodId>('REMOVE_POINTS');
export const resetPoints = creator('RESET_POINTS');
export const fetchPointsByUser = creator<UserId>('FETCH_POINTS_BY_USER');
