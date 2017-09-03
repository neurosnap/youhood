import { combineReducers } from 'redux';

import { State } from './types';
import { reducers as hoodReducers } from './packages/hood';
import { reducers as menuReducers } from './packages/menu';
import { reducers as pointReducers } from './packages/point';

export default combineReducers<State>({
  ...hoodReducers,
  ...menuReducers,
  ...pointReducers,
});
