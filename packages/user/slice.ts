import robodux, { mapSlice, createAction } from 'robodux';

import { User, UserHash } from '@youhood/types';
import { Action } from 'redux';
import { defaultUser } from './utils';

interface CurrentUserActions {
  setCurrentUser: (p: User) => Action<User>;
  resetCurrentUser: () => Action;
}

const currentUser = robodux<User, CurrentUserActions>({
  initialState: defaultUser,
  actions: {
    setCurrentUser: (state, p: User) => p,
    resetCurrentUser: () => defaultUser,
  },
  slice: 'currentUser',
});

interface UserHashActions {
  setUsers: (p: UserHash) => Action<UserHash>;
  addUsers: (p: UserHash) => Action<UserHash>;
  removeUsers: (p: string[]) => Action<string[]>;
  resetUsers: () => Action;
}

const users = mapSlice<UserHash, UserHashActions>({
  slice: 'users',
});

const actions = {
  ...currentUser.actions,
  ...users.actions,
  fetchUser: createAction<string>('FETCH_USER'),
};

const reducers = {
  [currentUser.slice]: currentUser.reducer,
  [users.slice]: users.reducer,
};

const currentUserSlice = 'currentUser';
const usersSlice = 'users';

export { actions, reducers, currentUserSlice, usersSlice };
