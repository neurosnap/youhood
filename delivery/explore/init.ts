import * as h from 'react-hyperscript';
import { Provider } from 'react-redux';
import { render } from 'react-dom';

import { actions } from '@youhood/bootup';
const { webBootup } = actions;

import createState from './store';
import { rootReducer, rootSaga } from './packages';
import App from './app';
import { setupMap } from './maps';
import { PersistGate } from 'redux-persist/integration/react';

interface WindowInterface extends Window {
  reduxStore: any;
}

export default () => {
  const hoodMap = setupMap();
  const { store, persistor } = createState({
    hoodMap,
    rootReducer,
    rootSaga,
    initState: {},
  });
  (window as WindowInterface).reduxStore = store;

  store.dispatch(webBootup());
  const AppConn = () =>
    h(Provider, { store }, [
      h(PersistGate, { loading: null, persistor }, [h(App)]),
    ]);

  render(h(AppConn), document.querySelector('#app'));
};
