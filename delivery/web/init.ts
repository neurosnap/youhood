import * as h from 'react-hyperscript';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { PersistGate } from 'redux-persist/integration/react';

import createState from './store';
import { rootReducer, rootSaga } from './packages';
import App from './app';

interface WindowInterface extends Window {
  reduxStore: any;
}

export default () => {
  const { store, persistor } = createState({
    rootReducer,
    rootSaga,
    initState: {},
  });
  (window as WindowInterface).reduxStore = store;

  const AppConn = () =>
    h(Provider, { store }, [
      h(PersistGate, { loading: null, persistor }, [h(App)]),
    ]);

  render(h(AppConn), document.querySelector('#app'));
};
