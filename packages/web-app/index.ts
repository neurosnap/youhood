import * as h from 'react-hyperscript';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { hot } from 'react-hot-loader';
import createHistory from 'history/createBrowserHistory';

import { actions } from '@youhood/bootup';
const { webBootup } = actions;

import createState from './store';
import { rootReducer, rootSaga } from './packages';
import App from './app';
import { setupMap } from './maps';
import { PersistGate } from 'redux-persist/integration/react';
import { Location } from 'history';

interface WindowInterface extends Window {
  reduxStore: any;
}

const mapVisibility = (location: Location) => {
  const path = location.pathname;
  const map = document.getElementById('map');

  // only show map for the explore page
  if (path === '/') {
    map.style.display = 'block';
  } else {
    map.style.display = 'none';
  }
};

export default () => {
  const history = createHistory();
  history.listen(mapVisibility);
  mapVisibility(window.location as any);

  const hoodMap = setupMap();
  const { store, persistor } = createState({ hoodMap, rootReducer, rootSaga });
  (window as WindowInterface).reduxStore = store;

  store.dispatch(webBootup());
  const prepApp = () =>
    h(Provider, { store }, [
      h(PersistGate, { loading: null, persistor }, [h(App, { history })]),
    ]);
  const hotApp = hot(module)(prepApp);

  render(h(hotApp), document.querySelector('#app'));
};
