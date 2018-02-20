import * as h from 'react-hyperscript';
import { Provider } from 'react-redux';
import { render } from 'react-dom';

import { actionCreators } from '@youhood/web-bootup';
const { webBootup } = actionCreators;

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

  store.dispatch(webBootup());

  render(
    h(Provider, { store }, [
      h(App, { hoodMap }),
    ]),
    document.querySelector('#app'),
  );
};
