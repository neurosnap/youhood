import { User, UserId, UserHash } from '@youhood/user/types';

type State = any;
export const currentUser = 'currentUser';
export const users = 'users';

export const getCurrentUserId = (state: State): UserId => state[currentUser];
export const getUsers = (state: State): UserHash => state[users];
export const getCurrentUser = (state: State): User => {
  const userId = getCurrentUserId(state);
  if (!userId) return null;
  return getUserById(state, { id: userId });
};
export const getUserById = (
  state: State,
  { id = '' }: { id: UserId },
): User => {
  if (!id) return null;
  return getUsers(state)[id];
};
