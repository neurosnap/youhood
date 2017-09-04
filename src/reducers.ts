import { combineReducers } from 'redux';

import { State } from './types';
import { reducers as hoodReducers } from './packages/hood';
import { reducers as menuReducers } from './packages/menu';
import { reducers as pointReducers } from './packages/point';
import { reducers as userReducers } from './packages/user';

export default combineReducers<State>({
  ...hoodReducers,
  ...menuReducers,
  ...pointReducers,
  ...userReducers,
});
