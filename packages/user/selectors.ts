import { WebState, User, UserHash } from '@youhood/types';

import { currentUserSlice, usersSlice } from './slice';

export const getCurrentUser = (state: WebState): User =>
  state[currentUserSlice];
export const getCurrentUserId = (state: WebState) => getCurrentUser(state).id;
export const getUsers = (state: WebState): UserHash => state[usersSlice];
export const getUserById = (
  state: WebState,
  { id = '' }: { id: string },
): User => {
  return getUsers(state)[id];
};
