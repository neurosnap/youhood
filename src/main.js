/* @flow */
import leafletPip from '@mapbox/leaflet-pip';
import L from 'leaflet';
import 'leaflet-draw';
import h from 'react-hyperscript';
import { Component } from 'react';
import ReactDOM from 'react-dom';

const state = {
  selected: null,
};

// https://gist.github.com/jed/982883
function createUuid(a: any): string {
  /* eslint-disable max-len, space-infix-ops, no-mixed-operators, no-bitwise */
  return a ?
    (a ^ Math.random() * 16 >> a / 4).toString(16)
    : ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, createUuid);
}

function getHoodFeature(hood) {
  return hood.feature || hood;
}

function getHoodProperties(hood) {
  return getHoodFeature(hood).properties;
}

function getHoodId(hood) {
  return getHoodProperties(hood).id;
}

function getHoodName(hood) {
  return getHoodProperties(hood).name;
}

function setHoodName(hood, value) {
  /* eslint-disable no-param-reassign */
  getHoodProperties(hood).name = value;
}

function isHoodSelected(hood) {
  if (!state.selected) return false;
  return getHoodId(state.selected) === getHoodId(hood);
}

function showHoodOverlay(hood) {
  const name = getHoodName(hood);
  const id = getHoodId(hood);
  renderOverlay({ id, defaultName: name, show: true });
}

function hideHoodOverlay() {
  renderOverlay({ show: false });
}

function clearSelectedHood() {
  const hood = state.selected;
  deselectHood(hood);
}

function deselectHood(hood) {
  if (!hood) return;
  getHoodProperties(hood).selected = false;
  hood.setStyle(styleFn(hood));
  state.selected = null;
  hideHoodOverlay();
}

function selectHood(hood) {
  if (!hood) return;
  console.log('SELECT', hood);
  getHoodProperties(hood).selected = true;
  hood.setStyle(styleFn(hood));
  state.selected = hood;
  showHoodOverlay(hood);
}

function toggleSelectHood(hood) {
  console.log('TOGGLE', hood);
  if (isHoodSelected(hood)) {
    deselectHood(hood);
    return;
  }

  clearSelectedHood();
  selectHood(hood);
}

/* function removeHood(hood) {
  if (!hood) return;
  hood.remove();
} */

class Overlay extends Component {
  static defaultProps = {
    id: '',
    defaultName: '',
    show: false,
  };

  state = {
    name: '',
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      this.setState({ name: nextProps.defaultName });
    }
  }

  props: {
    id: string,
    defaultName: string,
    show: boolean,
  };

  handleSave = () => {
    const { name } = this.state;
    if (!state.selected) return;
    setHoodName(state.selected, name);
  };

  handleClose = () => {
    deselectHood(state.selected);
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
        h('button', { onClick: this.handleClose }, 'Close'),
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

const hoodStyle = () => ({
  color: 'blue',
});

const hoodStyleSelected = () => ({
  color: 'yellow',
});

const styleFn = (hood) => {
  console.log(hood);
  if (getHoodProperties(hood).selected === true) {
    return hoodStyleSelected();
  }

  return hoodStyle();
};

const tileMapUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
const attribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
const map = L
  .map(getMap(), { doubleClickZoom: false })
  .setView([42.279594, -83.732124], 13);

L.tileLayer(tileMapUrl, { attribution })
 .addTo(map);

const drawnItems = L.geoJson(undefined, {
  style: styleFn,
}).addTo(map);

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
  const hood = event.layer.toGeoJSON();
  const id = createUuid();
  hood.properties = {
    id,
    selected: false,
    name: '',
  };

  drawnItems.addData(hood);
  selectHood(hood);
});

map.on('click', (event) => {
  const results = leafletPip.pointInLayer(event.latlng, drawnItems);
  console.log(results);
  if (results.length === 0) {
    return;
  }
  toggleSelectHood(results[0]);
});
