import robodux from 'robodux';

import { HoodIds } from '@youhood/hood/types';
import { WebState } from '@youhood/types';

const slice = 'hoodWinners';
const { actions, reducer } = robodux({
  initialState: [],
  actions: {
    setHoodWinners: (state: HoodIds, payload: HoodIds) => payload,
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
