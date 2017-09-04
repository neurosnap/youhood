import * as createUuid from 'uuid/v4';

import {
  PolygonHood,
  PolygonLeaflet,
  Hood,
  HoodProperties,
  HoodId,
} from '../../types';

const defaultHood = {};
export const createHood = (props: { [key: string]: any } = defaultHood): HoodProperties => ({
  id: props.id || createUuid(),
  userId: props.userId || '',
  name: props.name || '',
  city: props.city || '',
  county: props.county || '',
  state: props.state || '',
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

export function setHoodName(polygon: PolygonHood, value: string) {
  /* eslint-disable no-param-reassign */
  getHoodProperties(polygon).name = value;
}
