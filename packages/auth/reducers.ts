import { AuthError, AuthErrorAction } from './types';

import { authError as authErrorAction } from './actions';
import * as selectors from './selectors';

const authError = (state: AuthError = '', action: AuthErrorAction) => {
  switch (action.type) {
    case `${authErrorAction}`:
      return action.payload;
    default:
      return state;
  }
};

export default {
  [selectors.authError]: authError,
};
