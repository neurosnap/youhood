import * as createUuid from 'uuid/v4';

import { HoodGeoJSON } from '@youhood/map/types';

import {
  PolygonHood,
  PolygonLeaflet,
  Hood,
  HoodProps,
  HoodId,
  HoodPropsMap,
  HoodUIPropsMap,
  ApplyStyle,
} from './types';
import styleFn from './style';

const defaultHood = {};
export const createHood = (
  props: { [key: string]: any } = defaultHood,
): HoodProps => ({
  id: props.id || createUuid(),
  userId: props.userId || '',
  name: props.name || '',
  city: props.city || '',
  county: props.county || '',
  state: props.state || '',
  createdAt: props.createdAt || '',
  updatedAt: props.updatedAt || '',
  votes: 0,
});

export const createHoodUI = (props: { [key: string]: any } = defaultHood) => ({
  id: props.id,
  visible: props.visible || true,
});

export function getHoodProps(polygon: PolygonHood): HoodProps {
  if (polygon.hasOwnProperty('feature')) {
    return (<PolygonLeaflet>polygon).feature.properties;
  }

  return (<Hood>polygon).properties;
}

export function getHoodId(polygon: PolygonHood): HoodId {
  if (!polygon) return '';
  const props = getHoodProps(polygon);
  return props ? props.id : '';
}

export function findHood(layers: HoodGeoJSON, hoodId: HoodId): PolygonHood {
  let hood = null;

  layers.eachLayer((layer) => {
    if (getHoodId(layer) === hoodId) {
      hood = layer;
    }
  });

  return hood;
}

export function removeLayerByHoodId(hoodGeoJSON: HoodGeoJSON, hoodId: HoodId) {
  const hood = findHood(hoodGeoJSON, hoodId);
  if (!hood) {
    return;
  }

  hoodGeoJSON.removeLayer(<L.Layer>hood);
}

export function getHoodPropsMapFromHoods(hoods: PolygonHood[]): HoodPropsMap {
  return hoods.reduce((acc: HoodPropsMap, hood: any) => {
    const props = getHoodProps(hood);
    const hoodId = getHoodId(hood);
    return { ...acc, [hoodId]: createHood(props) };
  }, {});
}

export function getHoodUIPropsMapFromHoods(
  hoods: PolygonHood[],
): HoodUIPropsMap {
  return hoods.reduce((acc: HoodUIPropsMap, hood: any) => {
    const props = getHoodProps(hood);
    const hoodId = getHoodId(hood);
    return { ...acc, [hoodId]: createHoodUI(props) };
  }, {});
}

export function bindTooltip(hood: PolygonLeaflet, name: string) {
  hood.bindTooltip(name, {
    sticky: true,
    offset: [25, 0],
    direction: 'right',
  });
}

export function applyStyle({ hoodMap, hoodId, style }: ApplyStyle) {
  const hood = <PolygonLeaflet>findHood(hoodMap.hoodGeoJSON, hoodId);
  if (!hood) return;

  hood.setStyle(styleFn(style));
  hood.bringToFront();
}
