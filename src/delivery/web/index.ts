import h from 'react-hyperscript';
import { Provider } from 'react-redux';
import { render } from 'react-dom';

import createState from '../../store';

import App from './app';
import { setupMap, setupMapEvents } from './maps';

interface WindowInterface extends Window {
  reduxStore: any;
}

const store = createState();
(window as WindowInterface).reduxStore = store;

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

const { map, drawnItems } = setupMap({ store, socket });
setupMapEvents({ store, socket, map, drawnItems });
