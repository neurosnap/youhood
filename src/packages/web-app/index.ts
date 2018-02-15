import * as h from 'react-hyperscript';
import { Provider } from 'react-redux';
import { render } from 'react-dom';

import createState from './store';
import { rootReducer, rootSaga } from './packages';

import App from './components/app';
import { setupMap } from './maps';

interface WindowInterface extends Window {
  reduxStore: any;
}

export default () => {
  const hoodMap = setupMap();
  const store = createState({ hoodMap, rootReducer, rootSaga });
  (window as WindowInterface).reduxStore = store;

  render(
    h(Provider, { store }, [
      h(App, { hoodMap }),
    ]),
    document.querySelector('#app'),
  );
};