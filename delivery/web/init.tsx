import * as React from 'react';
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

  const AppConn = () => (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  );

  render(<AppConn />, document.querySelector('#app'));
};
