import * as h from 'react-hyperscript';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { hot } from 'react-hot-loader';

import { actions } from '@youhood/bootup';
const { webBootup } = actions;
import { smartComponents } from '@youhood/ui';
const { Onboard } = smartComponents;

import createState from './store';
import { rootReducer, rootSaga } from './packages';
import App from './app';
import { setupMap } from './maps';

interface WindowInterface extends Window {
  reduxStore: any;
}

export default () => {
  const hoodMap = setupMap();
  const store = createState({ hoodMap, rootReducer, rootSaga });
  (window as WindowInterface).reduxStore = store;

  store.dispatch(webBootup());
  const prepApp = () => h(Provider, { store }, [h(App, { hoodMap })]);
  const hotApp = hot(module)(prepApp);
  const onboardApp = () => h(Provider, { store }, [h(Onboard)]);

  render(h(hotApp), document.querySelector('#app'));
  render(h(onboardApp), document.querySelector('#modal'));
};
