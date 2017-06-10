/* @flow */
import type { State } from './types';

export default function createState(): State {
  return {
    selected: null,
    polygons: [],
  };
}
