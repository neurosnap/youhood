import { combineReducers } from 'redux';

import { State } from './types';
import { reducers as hoodReducers } from './packages/hood';
import { reducers as menuReducers } from './packages/menu';

export default combineReducers<State>({
  ...hoodReducers,
  ...menuReducers,
});
