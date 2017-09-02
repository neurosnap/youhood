import * as h from 'react-hyperscript';
import { Provider } from 'react-redux';
import { render } from 'react-dom';

import createState from '../../store';

import App from './app';
import { setupMap } from './maps';

interface WindowInterface extends Window {
  reduxStore: any;
}

const hoodMap = setupMap();
const store = createState({ hoodMap });
(window as WindowInterface).reduxStore = store;

render(
  h(Provider, { store }, [
    h(App, { hoodMap }),
  ]),
  document.querySelector('#app'),
);
