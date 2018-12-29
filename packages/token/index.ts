import robodux from 'robodux';

import { Action, Token, WebState } from '@youhood/types';

interface TokenActions {
  setToken: (p: Token) => Action<Token>;
  resetToken: () => Action;
}

const slice = 'token';
const { actions, reducer } = robodux<string, TokenActions>({
  slice,
  initialState: '',
  actions: {
    setToken: (state: Token, payload: Token) => payload,
    resetToken: () => '',
  },
});

const reducers = {
  [slice]: reducer,
};

const getToken = (state: WebState) => state[slice];
const getIsUserLoggedIn = (state: WebState) => !!getToken(state);
const selectors = {
  getToken,
  getIsUserLoggedIn,
};

export { actions, selectors, reducers, slice };
