import { creator } from '../shared';

import * as types from './action-types';

export const hideMenu = creator(types.HIDE_MENU);
export const showMenu = creator(types.SHOW_MENU);
