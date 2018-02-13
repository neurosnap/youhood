import { combineReducers } from 'redux';

import { State } from './types';
import { reducers as hoodReducers } from '@youhood/hood';
import { reducers as menuReducers } from '@youhood/menu';
import { reducers as pointReducers } from '@youhood/point';
import { reducers as userReducers } from '@youhood/user';
import { reducers as authReducers } from '@youhood/auth';
import { reducers as voteReducers } from '@youhood/vote';

export default combineReducers<State>({
  ...hoodReducers,
  ...menuReducers,
  ...pointReducers,
  ...userReducers,
  ...authReducers,
  ...voteReducers,
});
