import { UserId, UserHash } from '../../types';
import { SetUserAction, AddUsersAction } from './action-creators';
import { ADD_USERS, SET_USER } from './action-types';
import * as selectors from './selectors';

const currentUser = (state: UserId = '', action: SetUserAction): UserId => {
  switch (action.type) {
  case SET_USER:
    return action.payload;
  default:
    return state;
  }
};

const users = (state: UserHash = {}, action: AddUsersAction): UserHash => {
  switch (action.type) {
  case ADD_USERS: {
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
