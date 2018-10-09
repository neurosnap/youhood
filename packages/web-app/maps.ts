import * as L from 'leaflet';
import 'leaflet-draw';

import { HoodGeoJSON, HoodMap } from '@youhood/map/types';

// ann arbor, mi
const INIT_COORDS: [number, number] = [42.279594, -83.732124];

function getMap(doc = document): HTMLElement {
  return <HTMLElement>doc.querySelector('.map');
}

export function setupMap(): HoodMap {
  const tileMapUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const attribution =
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
  const map = L.map(getMap(), { doubleClickZoom: false, minZoom: 13 }).setView(
    INIT_COORDS,
    14,
  );

  L.tileLayer(tileMapUrl, { attribution }).addTo(map);

  const hoodGeoJSON: HoodGeoJSON = L.geoJSON(null).addTo(map);

  const drawControl = new (<any>L.Control).Draw({
    draw: {
      marker: false,
      rectangle: false,
      polyline: false,
      circle: false,
      circlemarker: false,
      polygon: false,
    },
  });

  map.addControl(drawControl);

  return {
    map,
    hoodGeoJSON,
    drawControl,
  };
}
