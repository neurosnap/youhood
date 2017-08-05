import createUuid from 'uuid/v4';

import { Hood, GeoJson, HoodProperties, HoodUser, HoodId } from '../../types';
import styleFn from './style';

const defaultHood = { user: {} };
export const createHood = (props: { [key: string]: any } = defaultHood): HoodProperties => ({
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

export function getHoodFeature(polygon: Hood): GeoJson {
  return polygon.feature;
}

export function getHoodProperties(polygon: Hood): HoodProperties {
  return getHoodFeature(polygon).properties;
}

export function getHoodId(polygon: Hood): HoodId {
  if (!polygon) return '';
  return getHoodProperties(polygon).id;
}

export function getHoodName(polygon: Hood): string {
  if (!polygon) return '';
  return getHoodProperties(polygon).name;
}

export function getHoodUser(polygon: Hood): HoodUser {
  if (!polygon) return { id: '', name: '' };
  return getHoodProperties(polygon).user;
}

export function setHoodName(polygon: Hood, value: string) {
  /* eslint-disable no-param-reassign */
  getHoodProperties(polygon).name = value;
}

export function hoverHood(polygon: Hood, hover: boolean) {
  if (!polygon) return;
  polygon.setStyle(styleFn({ hover }));
}
