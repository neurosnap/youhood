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
  console.log('SETUP MAP');
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
    edit: {
      featureGroup: hoodGeoJSON,
    },
    draw: {
      marker: false,
      rectangle: false,
      polyline: false,
      circle: false,
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

/* const Save = L.Control.extend({
    onAdd() {
      const save = <HTMLLinkElement>L.DomUtil.create('a');
      save.href = '#';
      save.className = 'leaflet-bar leaflet-save';
      save.innerHTML = 'Save';

      save.addEventListener('click', (e) => {
        e.preventDefault();
        const data = { type: 'save-hoods', data: hoodGeoJSON.toGeoJSON() };
        console.log('SAVING', data);
        socket.send(JSON.stringify(data));
      });

      return save;
    },
    onRemove() {},
  });

  L.control.save = (opts: any) => new Save(opts);
  L.control.save({ position: 'topleft' }).addTo(map); */
