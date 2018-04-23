import * as L from 'leaflet';
import { createHood } from './utils';

import { HoodMap } from '@youhood/map/types';
import { Hood } from './types';

export const mockHood = (): Hood => ({
  type: 'Feature',
  geometry: null,
  properties: createHood(),
 });

export const mockLayer = {
  toGeoJSON: mockHood,
};

export const mockHoodGeoJSON = () => L.geoJSON();

export const mockHoodMap = ({ onlyGeoJSON = false } = {}): HoodMap  => {
  const obj: HoodMap = {
    hoodGeoJSON: mockHoodGeoJSON(),
    drawControl: null,
    map: null,
  };

  if (!onlyGeoJSON) {
    obj.map = L.map(document.body);
  }

  return obj;
};

export function cleanupHoodMap(hoodMap: HoodMap) {
  hoodMap.map.remove();
}
