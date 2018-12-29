import * as h from 'react-hyperscript';
import { Router, Route, Redirect } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { History } from 'history';
import { SFC } from 'react';
import { connect } from 'react-redux';

import { WebState } from '@youhood/types';
import { smartComponents } from '@youhood/ui';
const {
  Overlay,
  Navbar,
  HoodBar,
  Onboard,
  SigninPage,
  AccountPage,
} = smartComponents;
import { selectors } from '@youhood/token';
const { getIsUserLoggedIn } = selectors;

import Docs from './docs';

// explore specific global styles
const ExploreGlobalStyle = createGlobalStyle`
  html {
    overflow: hidden;
  }

  body {
    overflow: hidden;
  }

  #map {
    height: calc(100vh - 84px);
    width: 100vw;
  }
`;

const Explore = () =>
  h('div', [
    h(Overlay),
    h(Navbar),
    h(HoodBar),
    h(Onboard),
    h(ExploreGlobalStyle),
  ]);

interface IAuth {
  isUserLoggedIn: boolean;
}

const mapState = (state: WebState) => {
  return {
    isUserLoggedIn: getIsUserLoggedIn(state),
  };
};
const AuthRequired = (Component: any) => {
  const req: SFC<IAuth> = ({ isUserLoggedIn }) => {
    if (!isUserLoggedIn) {
      return h(Redirect, { to: '/signin' });
    }

    return h(Component);
  };

  return connect(mapState)(req);
};

const App: React.SFC<{ history: History }> = ({ history }) =>
  h(Router, { history }, [
    h('div', { style: { height: '100%' } }, [
      h(Route, { exact: true, path: '/', component: Explore }),
      h(Route, { exact: true, path: '/docs', component: Docs }),
      h(Route, { exact: true, path: '/signin', component: SigninPage }),
      h(Route, {
        exact: true,
        path: '/account',
        component: AuthRequired(AccountPage),
      }),
    ]),
  ]);

export default App;
