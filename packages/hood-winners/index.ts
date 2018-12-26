import { Action } from 'redux';
import robodux from 'robodux';

import { HoodIds } from '@youhood/hood/types';
import { WebState } from '@youhood/types';

interface Actions {
  setHoodWinners: (p: HoodIds) => Action<HoodIds>;
  resetHoodWinners: () => Action;
}

const slice = 'hoodWinners';
const { actions, reducer } = robodux<HoodIds, Actions>({
  initialState: [],
  actions: {
    setHoodWinners: (state, payload: HoodIds) => payload,
    resetHoodWinners: () => [],
  },
  slice,
});

const reducers = {
  [slice]: reducer,
};

const getHoodWinners = (state: WebState) => state[slice];
const selectors = {
  getHoodWinners,
};

export { actions, reducers, selectors };
