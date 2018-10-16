import robodux from 'robodux';
import { OnboardState, WebState } from '@youhood/types';
import { Action } from 'redux';

const defaultState = { showOnboard: true, completed: null as number };

const slice = 'onboard';

interface Actions {
  completeOnboard: (d: number) => Action;
  resetOnboard: () => Action;
}

const { actions, reducer } = robodux<OnboardState, Actions, WebState>({
  slice,
  initialState: defaultState,
  actions: {
    completeOnboard: (state: OnboardState, payload: number) => ({
      showOnboard: false,
      completed: payload,
    }),
    resetOnboard: (state: OnboardState) => defaultState,
  },
});

const getOnboard = (state: WebState) => state[slice];
const shouldShowOnboard = (state: WebState) => getOnboard(state).showOnboard;

const selectors = {
  getOnboard,
  shouldShowOnboard,
};

const reducers = {
  [slice]: reducer,
};

export { actions, reducers, selectors };
