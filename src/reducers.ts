import { combineReducers } from 'redux';

import { reducers as hoodReducers } from './packages/hood';
import { reducers as menuReducers } from './packages/menu';

export default combineReducers({
  ...hoodReducers,
  ...menuReducers,
});
