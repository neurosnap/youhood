import * as L from 'leaflet';
import 'leaflet-draw';
import { createHood } from './utils';

import { HoodMap } from '@youhood/map/types';
import { Hood } from './types';

export const mockHood = (): Hood => ({
  type: 'Feature',
  geometry: { type: 'Polygon', coordinates: [] },
  properties: createHood(),
});

export const mockLayer = {
  toGeoJSON: mockHood,
};

export const mockHoodGeoJSON = () => L.geoJSON();

export const mockHoodMap = ({ onlyGeoJSON = false } = {}): HoodMap => {
  const obj: HoodMap = {
    hoodGeoJSON: mockHoodGeoJSON(),
    drawControl: {} as any,
    map: L.map(document.body),
  };

  return obj;
};

export function cleanupHoodMap(hoodMap: HoodMap) {
  hoodMap.map.remove();
}
