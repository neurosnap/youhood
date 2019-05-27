import robodux, { mapSlice, createAction } from 'robodux';

import { User, UserHash } from '@youhood/types';
import { defaultUser } from './utils';

const currentUser = robodux({
  initialState: defaultUser,
  actions: {
    setCurrentUser: (state: User, p: User) => p,
    resetCurrentUser: () => defaultUser,
  },
  slice: 'currentUser',
});

interface UserHashActions {
  setUsers: UserHash;
  addUsers: UserHash;
  removeUsers: string[];
  resetUsers: never;
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
