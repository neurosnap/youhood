import * as L from 'leaflet';
import 'leaflet-draw';

import { HoodGeoJSON, HoodMap } from '@youhood/map/types';

function getMap(doc = document): HTMLElement {
  return <HTMLElement>doc.querySelector('.map');
}

export function setupMap(): HoodMap {
  const tileMapUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const attribution =
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
  const map = L.map(getMap(), { doubleClickZoom: false }).setView(
    [42.279594, -83.732124],
    13,
  );

  L.tileLayer(tileMapUrl, { attribution }).addTo(map);

  const hoodGeoJSON: HoodGeoJSON = L.geoJSON(null).addTo(map);

  const drawControl = new L.Control.Draw({
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
