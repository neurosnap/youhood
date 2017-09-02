import L from 'leaflet';
import 'leaflet-draw';
import leafletPip from '@mapbox/leaflet-pip';
import { Store } from 'redux';

import {
  HoodGeoJSON,
  HoodMap,
  Hood,
  Hoods,
  State,
  WebSocketEvent,
  WebSocketMessage,
} from '../../types';
import { utils, actionCreators, selectors } from '../../packages/hood';
import { actionCreators as menuActionCreators } from '../../packages/menu';

const { getHoods } = selectors;
const { createHood, getHoodId } = utils;
const {
  selectHood,
  toggleHoodSelected,
  setHoodsOnPoint,
  addHoods,
} = actionCreators;
const { showMenu } = menuActionCreators;

function getMap(doc = document): HTMLElement {
  return <HTMLElement>doc.querySelector('.map');
}

function gotHoods(event: WebSocketMessage, hoodGeoJSON: HoodGeoJSON) {
  const data = event.data;
  if (data.features.length === 0) return;
  hoodGeoJSON.addData(data);
}

interface Props {
  socket: WebSocket;
}

export function setupMap({ socket }: Props): HoodMap {
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

  const Save = L.Control.extend({
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
  L.control.save({ position: 'topleft' }).addTo(map);

  return {
    map,
    hoodGeoJSON,
  };
}

interface MapEventsProps {
  store: Store<State>;
  socket: WebSocket;
  hoodGeoJSON: HoodGeoJSON;
  map: L.Map;
}

interface MapEvent extends L.Event {
  layer: L.Polygon;
  latlng: L.LatLng;
}

export function setupMapEvents({ map, hoodGeoJSON, socket, store }: MapEventsProps) {
  map.on(L.Draw.Event.CREATED, (event: MapEvent) => {
    const hood = event.layer.toGeoJSON();
    hood.properties = createHood();
    hoodGeoJSON.addData(hood);
  });

  hoodGeoJSON.on('layeradd', (e: MapEvent) => {
    const polygon = e.layer.toGeoJSON();
    store.dispatch(selectHood(getHoodId(polygon)));
    store.dispatch(addHoods([polygon]));
  });

  map.on('click', (event: MapEvent) => {
    const polygons: Hoods = leafletPip.pointInLayer(event.latlng, hoodGeoJSON);

    if (polygons.length === 0) {
      return;
    }

    const hoodIds = polygons.map((polygon: Hood) => getHoodId(polygon));

    store.dispatch(setHoodsOnPoint(hoodIds));

    if (polygons.length === 1) {
      store.dispatch(toggleHoodSelected(getHoodId(polygons[0])));
      return;
    }

    store.dispatch(showMenu('overlay'));
  });

  socket.addEventListener('message', (event) => {
    const jso: WebSocketMessage = JSON.parse(event.data);
    console.log(jso);

    switch (jso.type) {
    case 'got-hoods':
      gotHoods(jso, hoodGeoJSON);
      break;
    default:
      break;
    }
  });
}
