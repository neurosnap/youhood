import * as createUuid from 'uuid/v4';

import {
  PolygonHood,
  PolygonLeaflet,
  Hood,
  HoodProperties,
  HoodId,
  HoodPropsMap,
} from './types';

const defaultHood = {};
export const createHood = (props: { [key: string]: any } = defaultHood): HoodProperties => ({
  id: props.id || createUuid(),
  userId: props.userId || '',
  name: props.name || '',
  city: props.city || '',
  county: props.county || '',
  state: props.state || '',
  visible: props.visible || true,
});

export function getHoodProperties(polygon: PolygonHood): HoodProperties {
  if (polygon.hasOwnProperty('feature')) {
    return (<PolygonLeaflet>polygon).feature.properties;
  }

  return (<Hood>polygon).properties;
}

export function getHoodId(polygon: PolygonHood): HoodId {
  if (!polygon) return '';
  const props = getHoodProperties(polygon);
  return props ? props.id : '';
}

export function getHoodName(polygon: PolygonHood): string {
  if (!polygon) return '';
  return getHoodProperties(polygon).name;
}

export function setHoodName(polygon: PolygonHood, value: string) {
  getHoodProperties(polygon).name = value;
}

export function findHood(layers: L.GeoJSON, hoodId: HoodId): PolygonHood {
  let hood = null;

  layers.eachLayer((layer) => {
    if (getHoodId(layer) === hoodId) {
      hood = layer;
    }
  });

  return hood;
}

export function getHoodPropsMapFromHoods(hoods: PolygonHood[]): HoodPropsMap {
  return hoods.reduce((acc: HoodPropsMap, hood: any) => {
    const props = getHoodProperties(hood);
    const hoodId = getHoodId(hood);
    acc[hoodId] = props;
    return { ...acc, [hoodId]: createHood(props) };
  }, {});
}

export function bindTooltip(hood: PolygonLeaflet, name: string) {
  hood.bindTooltip(name, {
    sticky: true,
    offset: [25, 0],
    direction: 'right',
  });
}
