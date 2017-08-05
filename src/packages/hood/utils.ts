import createUuid from 'uuid/v4';

import { Polygon, GeoJson, HoodProperties, HoodUser, HoodId } from '../../types';
import styleFn from './style';

const defaultHood = { user: {} };
export const createHood = (props: HoodProperties = defaultHood): HoodProperties => ({
  id: props.id || createUuid(),
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

export function getHoodId(polygon: Polygon): HoodId {
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

export function hoverHood(polygon: Polygon, hover: boolean) {
  if (!polygon) return;
  polygon.setStyle(styleFn({ hover }));
}
