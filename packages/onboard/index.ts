import robodux from 'robodux';
import { OnboardState, WebState } from '@youhood/types';

const defaultState = { showOnboard: true, completed: null as number };

const slice = 'onboard';

const { actions, reducer } = robodux({
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
