/* @flow */
import type { Polygon } from './types';
import { getHoodProperties } from './polygon';

const hoodStyle = () => ({
  color: 'blue',
});

const hoodStyleSelected = () => ({
  color: 'yellow',
});

const hoodStyleHover = () => ({
  color: 'green',
});

export default (hood: Polygon, hover: boolean = false) => {
  if (hover) {
    return hoodStyleHover();
  }

  if (getHoodProperties(hood).selected === true) {
    return hoodStyleSelected();
  }

  return hoodStyle();
};
