/* @flow */
import leafletPip from '@mapbox/leaflet-pip';
import L from 'leaflet';
import 'leaflet-draw';
import h from 'react-hyperscript';
import { Component } from 'react';
import ReactDOM from 'react-dom';
import createUuid from 'uuid/v4';

type State = {
  selected: ?Polygon,
  polygons: Polygons,
};

const state: State = {
  selected: null,
  polygons: [],
};

type PolygonOptions = {
  attribution: ?string,
  color: string,
  dashArray: ?string,
  dashOffset: ?string,
  fill: boolean,
  fillColor: ?string,
  fillOpacity: number,
  fillRule: string,
  interactive: boolean,
  lineCap: string,
  lineJoin: string,
  noClip: boolean,
  nonBubblingEvents: Array<Object>,
  opacity: number,
  pane: string,
  smoothFactor: number,
  stroke: boolean,
  weight: number,
};

type Polygon = {
  feature: GeoJson,
  options: PolygonOptions,
  _leaflet_id: number,
  setStyle: Function,
  bringToFront: Function,
};

type Polygons = Array<Polygon>;

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

const createHood = (props: HoodProperties | Object = {}): HoodProperties => ({
  id: props.id || createUuid(),
  selected: props.selected || false,
  name: props.name || '',
});

function getHoodFeature(polygon: Polygon): GeoJson {
  if (polygon.feature) return polygon.feature;
  return polygon;
}

function getHoodProperties(polygon: Polygon) {
  return getHoodFeature(polygon).properties;
}

function getHoodId(polygon: Polygon) {
  return getHoodProperties(polygon).id;
}

function getHoodName(polygon: Polygon) {
  return getHoodProperties(polygon).name;
}

function setHoodName(polygon: Polygon, value: string) {
  /* eslint-disable no-param-reassign */
  getHoodProperties(polygon).name = value;
}

function isHoodSelected(polygon: Polygon) {
  if (!state.selected) return false;
  return getHoodId(state.selected) === getHoodId(polygon);
}

function showHoodOverlay(polygon: Polygon) {
  const name = getHoodName(polygon);
  const id = getHoodId(polygon);
  renderOverlay({ id, defaultName: name, show: true, polygons: state.polygons });
}

function hideHoodOverlay() {
  renderOverlay({ show: false });
}

function clearSelectedHood() {
  const polygon: ?Polygon = state.selected;
  deselectHood(polygon);
}

function deselectHood(polygon: ?Polygon) {
  if (!polygon) return;
  getHoodProperties(polygon).selected = false;
  polygon.setStyle(styleFn(polygon));
  state.selected = null;
}

function selectHood(polygon: ?Polygon) {
  if (!polygon) return;
  clearSelectedHood();
  getHoodProperties(polygon).selected = true;
  polygon.setStyle(styleFn(polygon));
  polygon.bringToFront();
  state.selected = polygon;
  showHoodOverlay(polygon);
}

function hoverHood(polygon: ?Polygon, hover) {
  if (!polygon) return;
  polygon.setStyle(styleFn(polygon, hover));
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
    return h('div.overlay-container', [
      h(Hood, this.props),
      h(HoodSelection, this.props),
    ]);
  }
}

class HoodSelection extends Component {
  static defaultProps = {
    hoods: [],
    show: false,
  };

  props: {
    polygons: Polygons,
    show: boolean,
  };

  handleClick = (polygon: Polygon) => {
    toggleSelectHood(polygon);
  };

  handleHover = (polygon: Polygon, hover) => {
    hoverHood(polygon, hover);
  };

  render() {
    const { polygons, show } = this.props;
    if (!show || polygons.length < 2) return null;

    return h('div.overlay.hood-selection', polygons.map((polygon) => {
      const { id, name } = getHoodProperties(polygon);
      return h('div.hood-list-item', {
        key: id,
        onClick: () => this.handleClick(polygon),
        onMouseEnter: () => this.handleHover(polygon, true),
        onMouseLeave: () => this.handleHover(polygon, false),
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
    show: boolean,
  };

  handleSave = () => {
    const { name } = this.state;
    if (!state.selected) return;
    setHoodName(state.selected, name);
  };

  handleClose = () => {
    deselectHood(state.selected);
    hideHoodOverlay();
  };

  handleInput = (event) => {
    const name = event.target.value;
    this.setState({ name });
  };

  render() {
    const { show } = this.props;
    if (!show) return null;
    const { name } = this.state;

    return h('div.overlay.hood', [
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

const hoodStyleHover = () => ({
  color: 'green',
});

const styleFn = (hood, hover = false) => {
  if (hover) {
    return hoodStyleHover();
  }

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
  const polygon: Polygon = e.layer;
  selectHood(polygon);
});

map.on('click', (event) => {
  const polygons = leafletPip.pointInLayer(event.latlng, drawnItems);
  state.polygons = polygons;

  if (polygons.length === 0) {
    return;
  }

  if (polygons.length === 1) {
    toggleSelectHood(polygons[0]);
    return;
  }

  renderOverlay({ polygons, show: true });
});
