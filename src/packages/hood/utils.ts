import createUuid from 'uuid/v4';

import {
  PolygonHood,
  PolygonLeaflet,
  Hood,
  GeoJson,
  HoodProperties,
  HoodUser,
  HoodId,
} from '../../types';
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

export function getHoodProperties(polygon: PolygonHood): HoodProperties {
  if (polygon.hasOwnProperty('feature')) {
    return (<PolygonLeaflet>polygon).feature.properties;
  }

  return (<Hood>polygon).properties;
}

export function getHoodId(polygon: PolygonHood): HoodId {
  if (!polygon) return '';
  return getHoodProperties(polygon).id;
}

export function getHoodName(polygon: PolygonHood): string {
  if (!polygon) return '';
  return getHoodProperties(polygon).name;
}

export function getHoodUser(polygon: PolygonHood): HoodUser {
  if (!polygon) return { id: '', name: '' };
  return getHoodProperties(polygon).user;
}

export function setHoodName(polygon: PolygonHood, value: string) {
  /* eslint-disable no-param-reassign */
  getHoodProperties(polygon).name = value;
}
