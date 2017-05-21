import 'babel-polyfill';
import L from 'leaflet';
import 'leaflet-draw';

const state = {
  selected: null,
};

function getOverlay(doc = document) {
  return doc.querySelector('.overlay');
}

function getMap(doc = document) {
  return doc.querySelector('.map');
}

function getHoodInput(doc = document) {
  return doc.querySelector('.overlay .name input');
}

function getSave(doc = document) {
  return doc.querySelector('.overlay .actions .save');
}

function getHoodName() {
  const input = getHoodInput();
  console.log(input);
  return input.value;
}

function isNeighborhoodSelected(polygon) {
  if (!state.selected) return false;
  return state.selected._leaflet_id === polygon._leaflet_id;
}

function showNeighborhoodOverlay(polygon) {
  const overlay = getOverlay();
  overlay.classList.add('show');
  const hood = polygon.options.hood;
  getHoodInput().value = hood || '';
}

function hideNeighborhoodOverlay() {
  const overlay = getOverlay();
  overlay.classList.remove('show');
  getHoodInput().value = '';
}

const save = getSave();
save.addEventListener('click', () => {
  if (!state.selected) return;
  console.log('click');
  const value = getHoodName();
  console.log(value);
  state.selected.options.hood = value;
});

const polygonStyle = () => ({
  color: 'blue',
});

const polygonStyleSelected = () => ({
  color: 'yellow',
});

function polyClick(event) {
  console.log(event);
  const polygon = event.target;

  if (isNeighborhoodSelected(polygon)) {
    polygon.setStyle(polygonStyle());
    state.selected = null;
    hideNeighborhoodOverlay();
    return;
  }

  polygon.setStyle(polygonStyleSelected());

  state.selected = polygon;
  showNeighborhoodOverlay(polygon);
}

const tileMapUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
const attribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
const map = L
  .map(getMap(), { doubleClickZoom: false })
  .setView([42.279594, -83.732124], 13);

L.tileLayer(tileMapUrl, { attribution })
 .addTo(map);

const drawnItems = L.featureGroup().addTo(map);

L.control.layers(null, {
  Neighborhoods: drawnItems,
}, {
  position: 'topleft',
  collapsed: false,
}).addTo(map);

const drawControl = new L.Control.Draw({
  edit: {
    featureGroup: drawnItems,
    poly: {
      allowIntersection: false,
    },
  },
  draw: {
    marker: false,
    rectangle: false,
    polyline: false,
    circle: false,
    polygon: {
      allowIntersection: false,
      showArea: true,
    },
  },
});

map.addControl(drawControl);

map.on(L.Draw.Event.CREATED, (event) => {
  console.log(event);
  const layer = event.layer;
  layer.setStyle(polygonStyle());
  layer.on('click', polyClick);
  drawnItems.addLayer(layer);
});
