import { UserId, UserHash } from '@youhood/user/types';

import {
  SetUserAction,
  AddUsersAction,
  addUsers,
  setUser,
  resetUser,
} from './actions';
import * as selectors from './selectors';

const defaultState = '';
const currentUser = (
  state: UserId = defaultState,
  action: SetUserAction,
): UserId => {
  switch (action.type) {
    case `${setUser}`:
      return action.payload;
    case `${resetUser}`:
      return defaultState;
    default:
      return state;
  }
};

const users = (state: UserHash = {}, action: AddUsersAction): UserHash => {
  switch (action.type) {
    case `${addUsers}`: {
      const userArr = action.payload;
      if (userArr.length === 0) return state;

      const newUsers = { ...state };
      userArr.forEach((user) => {
        newUsers[user.id] = user;
      });
      return newUsers;
    }
    default:
      return state;
  }
};

export default {
  [selectors.currentUser]: currentUser,
  [selectors.users]: users,
};
