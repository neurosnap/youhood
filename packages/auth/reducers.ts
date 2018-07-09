import { Token, AuthError, TokenAction, AuthErrorAction } from './types';

import { setToken, resetToken, authError as authErrorAction } from './actions';
import * as selectors from './selectors';

const defaultState = '';

const token = (state: Token = defaultState, action: TokenAction) => {
  switch (action.type) {
    case `${setToken}`:
      return action.payload;
    case `${resetToken}`:
      return defaultState;
    default:
      return state;
  }
};

const authError = (state: AuthError = '', action: AuthErrorAction) => {
  switch (action.type) {
    case `${authErrorAction}`:
      return action.payload;
    default:
      return state;
  }
};

export default {
  [selectors.token]: token,
  [selectors.authError]: authError,
};
