import { UserId, Users } from '@youhood/user/types';

import { creator } from '@youhood/shared';

export interface SetUserAction {
  type: string;
  payload: UserId;
}

export interface AddUsersAction {
  type: string;
  payload: Users;
}

export const setUser = creator<UserId>('SET_USER');
export const addUsers = creator<Users>('ADD_USERS');
export const resetUser = creator('RESET_USER');
