/* @flow */
import L from 'leaflet';
import 'leaflet-draw';
import leafletPip from '@mapbox/leaflet-pip';
import h from 'react-hyperscript';
import { Provider } from 'react-redux';
import { render } from 'react-dom';

import type { Polygon } from './types';
import { OverlayConn } from './overlay';
import { Navbar } from './navbar';
import { createHood } from './hood';
import {
  selectHood,
  toggleHoodSelected,
  addHoods,
  setHoodsOnPoint,
  showMenu,
} from './action-creators';
import createState from './store';

const store = createState();
window.reduxStore = store;

const App = () =>
  h('div', [
    h(OverlayConn),
    h(Navbar),
  ]);

render(
  h(Provider, { store }, [
    h(App),
  ]),
  document.querySelector('#app'),
);

const socket = new WebSocket('ws://localhost:8080');
socket.addEventListener('open', () => {
  console.log('SOCKET CONNECTED');
  socket.send(JSON.stringify({ type: 'get-hoods' }));
});

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

const drawnItems = L.geoJson(store.getState().polygons).addTo(map);

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
  store.dispatch(addHoods([polygon]));
  store.dispatch(selectHood(polygon));
});

map.on('click', (event) => {
  const polygons = leafletPip.pointInLayer(event.latlng, drawnItems);

  if (polygons.length === 0) {
    return;
  }

  store.dispatch(setHoodsOnPoint(polygons));

  if (polygons.length === 1) {
    store.dispatch(toggleHoodSelected(polygons[0]));
    return;
  }

  store.dispatch(showMenu('overlay'));
});

socket.addEventListener('message', (event: Event) => {
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
  if (data.features.length === 0) return;
  drawnItems.addData(data.features);
  store.dispatch(addHoods(data.features));
}
