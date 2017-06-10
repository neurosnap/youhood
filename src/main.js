/* @flow */
import L from 'leaflet';
import 'leaflet-draw';
import leafletPip from '@mapbox/leaflet-pip';

import data from '../data/ann-arbor.json';

import type { Polygon } from './types';
import { renderOverlay } from './overlay';
import { createHood, selectHood, toggleSelectHood } from './polygon';
import createState from './state';

const state = createState();
state.polygons = data.features;

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
