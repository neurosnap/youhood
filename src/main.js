/* @flow */
import 'babel-polyfill';
import L from 'leaflet';
import 'leaflet-draw';
import h from 'react-hyperscript';
import { Component } from 'react';
import ReactDOM from 'react-dom';

const state = {
  selected: null,
};

function isNeighborhoodSelected(polygon) {
  if (!state.selected) return false;
  return state.selected._leaflet_id === polygon._leaflet_id;
}

function showNeighborhoodOverlay(polygon) {
  const hood = polygon.options.hood;
  renderOverlay({ name: hood, show: true });
}

function hideNeighborhoodOverlay() {
  renderOverlay({ show: false });
}

function deselectNeighborhood(polygon) {
  if (!polygon) return;
  polygon.setStyle(polygonStyle());
  state.selected = null;
  hideNeighborhoodOverlay();
}

function selectNeighborhood(polygon) {
  if (!polygon) return;
  polygon.setStyle(polygonStyleSelected());
  state.selected = polygon;
  showNeighborhoodOverlay(polygon);
}

function toggleNeighborhoodSelection(polygon) {
  if (isNeighborhoodSelected(polygon)) {
    deselectNeighborhood(polygon);
    return;
  }

  deselectNeighborhood(polygon);
  selectNeighborhood(polygon);
}

class Overlay extends Component {
  static defaultProps = {
    defaultName: '',
    show: false,
  };

  state = {
    name: '',
  };

  props: {
    defaultName: string,
    show: boolean,
  };

  handleSave = () => {
    const { name } = this.state;
    if (!state.selected) return;
    state.selected.options.hood = name;
  };

  handleCancel = () => {
    deselectNeighborhood(state.selected);
  };

  handleInput = (event) => {
    const name = event.target.value;
    this.setState({ name });
  };

  render() {
    const { defaultName, show } = this.props;
    const { name } = this.state;

    if (!show) return null;

    return h('div.overlay', [
      h('div', [
        h('label', { for: 'hood-name' }, 'Hood'),
        h('input', {
          type: 'input',
          defaultValue: defaultName,
          value: name,
          onChange: this.handleInput,
        }),
      ]),
      h('div.actions', [
        h('button', { onClick: this.handleSave }, 'Save'),
        h('button', { onClick: this.handleCancel }, 'Cancel'),
      ]),
    ]);
  }
}

function renderOverlay(props) {
  ReactDOM.render(
    h(Overlay, props),
    document.querySelector('.overlay-cont'),
  );
}

function getMap(doc = document) {
  return doc.querySelector('.map');
}

const polygonStyle = () => ({
  color: 'blue',
});

const polygonStyleSelected = () => ({
  color: 'yellow',
});

function polyClick(event) {
  console.log(event);
  const polygon = event.target;
  toggleNeighborhoodSelection(polygon);
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
  const layer = event.layer;
  console.log(layer);
  layer.setStyle(polygonStyle());
  layer.on('click', polyClick);
  selectNeighborhood(layer);
  drawnItems.addLayer(layer);
});
