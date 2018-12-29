import * as h from 'react-hyperscript';
import { SFC } from 'react';
import { connect } from 'react-redux';

import { WebState } from '@youhood/types';
import { pages } from '@youhood/ui';
const { SigninPage, AccountPage, DocPage } = pages;
import { selectors } from '@youhood/token';
const { getIsUserLoggedIn } = selectors;

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
      window.location.replace('/signin');
    }

    return h(Component);
  };

  return connect(mapState)(req);
};
const Redirect = (Component: any) => {
  const req: SFC<IAuth> = ({ isUserLoggedIn }) => {
    if (isUserLoggedIn) {
      // a little hacky
      window.location.replace('/');
    }

    return h(Component);
  };

  return connect(mapState)(req);
};

const App = () => {
  switch (location.pathname) {
    case '/docs':
      return h(DocPage);
    case '/account':
      return h(AuthRequired(AccountPage));
    default:
      return h(Redirect(SigninPage));
  }
};

export default App;
