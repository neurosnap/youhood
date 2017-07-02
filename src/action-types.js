/* @flow */
const handler = {
  get(target, name) {
    return name;
  },
};

const creator = new Proxy({}, handler);

export const {
  ADD_HOODS,
  CLEAR_HOODS_ON_POINT,
  DESELECT_HOOD,
  HIDE_MENU,
  SELECT_HOOD,
  SET_HOOD_NAME,
  SET_HOODS_ON_POINT,
  SET_HOODS,
  SHOW_MENU,
  TOGGLE_HOOD_SELECTED,
} = creator;
