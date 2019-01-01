import * as h from 'react-hyperscript';
import { SFC } from 'react';
import { connect } from 'react-redux';

import { WebState } from '@youhood/types';
import { selectors } from '@youhood/token';
const { getIsUserLoggedIn } = selectors;

// must use relative imports for proper tree-shaking since
// the ui package pulls everything in
import SigninPage from '../../packages/ui/page-signin';
import AccountPage from '../../packages/ui/page-account';
import DocPage from '../../packages/ui/page-docs';
import LandingPage from '../../packages/ui/page-landing';
import AboutPage from '../../packages/ui/page-about';
import PrivacyPage from '../../packages/ui/page-privacy';
import TosPage from '../../packages/ui/page-tos';
import PricingPage from '../../packages/ui/page-pricing';

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
    case '/pricing':
      return h(PricingPage);
    case '/tos':
      return h(TosPage);
    case '/privacy':
      return h(PrivacyPage);
    case '/about':
      return h(AboutPage);
    case '/docs':
      return h(DocPage);
    case '/account':
      return h(AuthRequired(AccountPage));
    case '/signin':
      return h(Redirect(SigninPage));
    default:
      return h(LandingPage);
  }
};

export default App;
