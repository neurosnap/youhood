import { User, UserId, UserHash } from '@youhood/user/types';
import { WebState } from '@youhood/types';

export const currentUser = 'currentUser';
export const users = 'users';

export const getCurrentUserId = (state: WebState): UserId => state[currentUser];
export const getUsers = (state: WebState): UserHash => state[users];
export const getCurrentUser = (state: WebState): User => {
  const userId = getCurrentUserId(state);
  if (!userId) return null;
  return getUserById(state, { id: userId });
};
export const getUserById = (
  state: WebState,
  { id = '' }: { id: UserId },
): User => {
  if (!id) return null;
  return getUsers(state)[id];
};
