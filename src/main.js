/* @flow */
import leafletPip from '@mapbox/leaflet-pip';
import L from 'leaflet';
import 'leaflet-draw';
import h from 'react-hyperscript';
import { Component } from 'react';
import ReactDOM from 'react-dom';
import createUuid from 'uuid/v4';

const state = {
  selected: null,
};

type HoodProperties = {
  id: string,
  selected: boolean,
  name: string,
};

type GeoJson = {
  geometry: {
    coordinates: Array<*>,
  },
  properties: HoodProperties,
  type: string,
};

type LeafletLayer = {
  feature: GeoJson,
};

type LayerOrGeo = LeafletLayer | GeoJson;

const createHood = (props: HoodProperties | Object = {}): HoodProperties => ({
  id: props.id || createUuid(),
  selected: props.selected || false,
  name: props.name || '',
});

function getHoodFeature(hood: LayerOrGeo): GeoJson {
  if (hood.feature) return hood.feature;
  return hood;
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
  clearSelectedHood();
  getHoodProperties(hood).selected = true;
  hood.setStyle(styleFn(hood));
  state.selected = hood;
  showHoodOverlay(hood);
}

function toggleSelectHood(hood) {
  if (isHoodSelected(hood)) {
    deselectHood(hood);
    return;
  }

  selectHood(hood);
}

/* function removeHood(hood) {
  if (!hood) return;
  hood.remove();
} */

class Overlay extends Component {
  render() {
    const { show } = this.props;

    if (!show) return null;
    return h('div.overlay', [
      h(Hood, this.props),
      h(HoodSelection, this.props),
    ]);
  }
}

class HoodSelection extends Component {
  static defaultProps = {
    hoods: [],
  };

  props: {
    hoods: Array<GeoJson>,
  };

  handleClick = (hood) => {
    selectHood(hood);
  };

  render() {
    const { hoods } = this.props;
    return h('div', hoods.map((hood) => {
      const { id, name } = getHoodProperties(hood);
      return h('div', {
        key: id,
        onClick: () => this.handleClick(hood),
      }, `[${name}] - ${id}`);
    }));
  }
}

class Hood extends Component {
  static defaultProps = {
    id: '',
    defaultName: '',
    show: false,
  };

  state = {
    name: '',
  };

  componentWillMount() {
    this.setState({ name: this.props.defaultName });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      this.setState({ name: nextProps.defaultName });
    }
  }

  props: {
    id: string,
    defaultName: string,
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
    const { name } = this.state;

    return h('div', [
      h('div', [
        h('label', { htmlFor: 'hood-name' }, 'Hood'),
        h('input', {
          type: 'input',
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

const drawnItems = L.geoJson().addTo(map);

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
  const hood = e.layer;
  selectHood(hood);
});

map.on('click', (event) => {
  const results = leafletPip.pointInLayer(event.latlng, drawnItems);
  if (results.length === 0) {
    return;
  }

  if (results.length === 1) {
    toggleSelectHood(results[0]);
    return;
  }

  renderOverlay({ hoods: results, show: true });
});
