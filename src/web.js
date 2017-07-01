/* @flow */
import L from 'leaflet';
import 'leaflet-draw';
import leafletPip from '@mapbox/leaflet-pip';

import type { Polygon } from './types';
import { renderOverlay } from './overlay';
import { createHood, selectHood, toggleSelectHood } from './polygon';
import createState from './state';

const socket = new WebSocket('ws://localhost:8080');
socket.addEventListener('open', () => {
  console.log('SOCKET CONNECTED');
  socket.send(JSON.stringify({ type: 'get-hoods' }));
});

const state = createState();

function getMap(doc = document) {
  return doc.querySelector('.map');
}

const tileMapUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
const attribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
const map = L
  .map(getMap(), { doubleClickZoom: false })
  .setView([42.279594, -83.732124], 13);

L.tileLayer(tileMapUrl, { attribution })
 .addTo(map);

const drawnItems = L.geoJson(state.polygons).addTo(map);

L.control.layers(null, {
  Neighborhoods: drawnItems,
}, {
  position: 'topleft',
  collapsed: false,
}).addTo(map);

const drawControl = new L.Control.Draw({
  edit: {
    featureGroup: drawnItems,
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

L.Control.Save = L.Control.extend({
  onAdd() {
    const save = L.DomUtil.create('a');
    save.href = '#';
    save.className = 'leaflet-bar leaflet-save';
    save.innerHTML = 'Save';

    save.addEventListener('click', (e) => {
      e.preventDefault();
      const data = { type: 'save-hoods', data: drawnItems.toGeoJSON() };
      console.log('SAVING', data);
      socket.send(JSON.stringify(data));
    });

    return save;
  },
  onRemove() {},
});

L.control.save = (opts) => new L.Control.Save(opts);
L.control.save({ position: 'topleft' }).addTo(map);

map.on(L.Draw.Event.CREATED, (event) => {
  const hood = event.layer.toGeoJSON();
  hood.properties = createHood();
  drawnItems.addData(hood);
});

drawnItems.on('layeradd', (e) => {
  const polygon: Polygon = e.layer;
  selectHood(polygon, state);
});

map.on('click', (event) => {
  const polygons = leafletPip.pointInLayer(event.latlng, drawnItems);
  state.polygons = polygons;

  if (polygons.length === 0) {
    return;
  }

  if (polygons.length === 1) {
    toggleSelectHood(polygons[0], state);
    return;
  }

  renderOverlay({ show: true, state });
});

socket.addEventListener('message', (event: Event) => {
  console.log(event);
  // $FlowFixMe
  const jso = JSON.parse(event.data);
  console.log(jso);

  switch (jso.type) {
    case 'got-hoods':
      gotHoods(jso);
      break;
    default:
      break;
  }
});

function gotHoods(event) {
  const data = event.data;
  drawnItems.addData(data.features);
  state.polygons.push(data.features);
}
