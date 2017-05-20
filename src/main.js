import 'babel-polyfill';
import L from 'leaflet';
import FreeDraw from 'leaflet-freedraw';

const tileMapUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
const attribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
const map = L.map(document.querySelector('.map')).setView([42.279594, -83.732124], 13);

L.tileLayer(tileMapUrl, { attribution }, { doubleClickZoom: false })
 .addTo(map);

const freeDraw = new FreeDraw({ mode: FreeDraw.ALL });

freeDraw.on('markers', (event) => {
  console.log(event.latLngs);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') freeDraw.cancel();
});

map.addLayer(freeDraw);
