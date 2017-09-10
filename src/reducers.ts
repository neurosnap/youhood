import { combineReducers } from 'redux';

import { State } from './types';
import { reducers as hoodReducers } from './packages/hood';
import { reducers as menuReducers } from './packages/menu';
import { reducers as pointReducers } from './packages/point';
import { reducers as userReducers } from './packages/user';
import { reducers as authReducers } from './packages/auth';
import { reducers as voteReducers } from './packages/vote';

export default combineReducers<State>({
  ...hoodReducers,
  ...menuReducers,
  ...pointReducers,
  ...userReducers,
  ...authReducers,
  ...voteReducers,
});
