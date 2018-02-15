import { Token, AuthError, TokenAction, AuthErrorAction } from './types';

import { SET_TOKEN, RESET_TOKEN, AUTH_ERROR } from './action-types';
import * as selectors from './selectors';

const defaultState = '';

const token = (state: Token = defaultState, action: TokenAction) => {
  switch (action.type) {
  case SET_TOKEN:
    return action.payload;
  case RESET_TOKEN:
    return defaultState;
  default:
    return state;
  }
};

const authError = (state: AuthError = '', action: AuthErrorAction) => {
  switch (action.type) {
  case AUTH_ERROR:
    return action.payload;
  default:
    return state;
  }
};

export default {
  [selectors.token]: token,
  [selectors.authError]: authError,
};
