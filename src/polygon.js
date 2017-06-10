/* @flow */
import createUuid from 'uuid/v4';

import type { State, Polygon, GeoJson, HoodProperties, HoodUser } from './types';
import { showHoodOverlay } from './overlay';
import styleFn from './style';

const defaultHood = { user: {} };
export const createHood = (props: HoodProperties | Object = defaultHood): HoodProperties => ({
  id: props.id || createUuid(),
  selected: props.selected || false,
  name: props.name || '',
  city: props.city || '',
  county: props.county || '',
  state: props.state || '',
  user: {
    id: props.user.id || createUuid(),
    name: props.user.name || 'Anonymous',
  },
});

export function getHoodFeature(polygon: Polygon): GeoJson {
  if (polygon.feature) return polygon.feature;
  return polygon;
}

export function getHoodProperties(polygon: Polygon): HoodProperties {
  return getHoodFeature(polygon).properties;
}

export function getHoodId(polygon: Polygon): string {
  if (!polygon) return '';
  return getHoodProperties(polygon).id;
}

export function getHoodName(polygon: Polygon): string {
  if (!polygon) return '';
  return getHoodProperties(polygon).name;
}

export function getHoodUser(polygon: Polygon): HoodUser {
  if (!polygon) return { id: '', name: '' };
  return getHoodProperties(polygon).user;
}

export function setHoodName(polygon: Polygon, value: string) {
  /* eslint-disable no-param-reassign */
  getHoodProperties(polygon).name = value;
}

export function isHoodSelected(polygon: Polygon, state: State): boolean {
  if (!state.selected) return false;
  return getHoodId(state.selected) === getHoodId(polygon);
}

export function clearSelectedHood(state: State) {
  const polygon: ?Polygon = state.selected;
  deselectHood(polygon, state);
}

export function deselectHood(polygon: ?Polygon, state: State) {
  if (!polygon) return;
  getHoodProperties(polygon).selected = false;
  polygon.setStyle(styleFn(polygon));
  state.selected = null;
}

export function selectHood(polygon: ?Polygon, state: State) {
  if (!polygon) return;
  clearSelectedHood(state);
  getHoodProperties(polygon).selected = true;
  polygon.setStyle(styleFn(polygon));
  polygon.bringToFront();
  state.selected = polygon;
  showHoodOverlay(polygon, state);
}

export function hoverHood(polygon: ?Polygon, hover: boolean) {
  if (!polygon) return;
  polygon.setStyle(styleFn(polygon, hover));
}

export function toggleSelectHood(hood: Polygon, state: State) {
  if (isHoodSelected(hood, state)) {
    deselectHood(hood, state);
    return;
  }

  selectHood(hood, state);
}
