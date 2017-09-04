import { UserId, Users } from '../../types';

import { creator } from '../shared';

import * as types from './action-types';

export interface SetUserAction {
  type: string;
  payload: UserId;
}

export interface AddUsersAction {
  type: string;
  payload: Users;
}

export const setUser = creator<UserId>(types.SET_USER);
export const addUsers = creator<Users>(types.ADD_USERS);
