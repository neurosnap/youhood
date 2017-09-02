import * as h from 'react-hyperscript';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { Store } from 'redux';

import createState from '../../store';
import { State } from '../../types';

import App from './app';
import { setupMap, setupMapEvents } from './maps';

interface WindowInterface extends Window {
  reduxStore: any;
}

const socket = new WebSocket('ws://localhost:8080');
socket.addEventListener('open', () => {
  console.log('SOCKET CONNECTED');
  socket.send(JSON.stringify({ type: 'get-hoods' }));
});

const hoodMap = setupMap({ socket });
const { map, hoodGeoJSON } = hoodMap;

const store = createState({ hoodMap });
(window as WindowInterface).reduxStore = store;

setupMapEvents({ store, socket, map, hoodGeoJSON });

render(
  h(Provider, { store }, [
    h(App, { hoodMap }),
  ]),
  document.querySelector('#app'),
);
