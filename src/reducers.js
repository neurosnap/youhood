/* @flow */
import { combineReducers } from 'redux';

import { reducers as hoodReducers } from './packages/hood';
import { reducers as menuReducers } from './packages/menu';

const { hoodSelected, hoodsOnPoint, hoods } = hoodReducers;
const { menus } = menuReducers;

export default combineReducers({
  selected: hoodSelected,
  hoodsOnPoint,
  polygons: hoods,
  menus,
});
