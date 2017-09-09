import * as L from 'leaflet';
import 'leaflet-draw';

import {
  HoodGeoJSON,
  HoodMap,
} from '../../types';

function getMap(doc = document): HTMLElement {
  return <HTMLElement>doc.querySelector('.map');
}

export function setupMap(): HoodMap {
  const tileMapUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
  const attribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
  const map = L
    .map(getMap(), { doubleClickZoom: false })
    .setView([42.279594, -83.732124], 13);

  L.tileLayer(tileMapUrl, { attribution })
   .addTo(map);

  const hoodGeoJSON: HoodGeoJSON = L.geoJSON().addTo(map);

  L.control.layers(null, {
    Neighborhoods: hoodGeoJSON,
  }, {
    position: 'topleft',
    collapsed: false,
  }).addTo(map);

  const drawControl = new L.Control.Draw({
    draw: {
      marker: false,
      rectangle: false,
      polyline: false,
      circle: false,
      // circlemarker: false,
      polygon: {
        showArea: true,
      },
    },
  });

  map.addControl(drawControl);

  return {
    map,
    hoodGeoJSON,
  };
}
