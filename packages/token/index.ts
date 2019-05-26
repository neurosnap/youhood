import robodux from 'robodux';

import { Token, WebState } from '@youhood/types';

const slice = 'token';
const { actions, reducer } = robodux({
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
