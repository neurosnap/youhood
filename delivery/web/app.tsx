import * as React from 'react';
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
import RegisterPage from '../../packages/ui/page-register';

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

    return <Component />;
  };

  return connect(mapState)(req);
};

const Redirect = (Component: any) => {
  const req: SFC<IAuth> = ({ isUserLoggedIn }) => {
    if (isUserLoggedIn) {
      // a little hacky
      window.location.replace('/explore');
    }

    return <Component />;
  };

  return connect(mapState)(req);
};

const App = () => {
  switch (location.pathname) {
    case '/pricing':
      return <PricingPage />;
    case '/tos':
      return <TosPage />;
    case '/privacy':
      return <PrivacyPage />;
    case '/about':
      return <AboutPage />;
    case '/docs':
      return <DocPage />;
    case '/account':
      return React.createElement(AuthRequired(AccountPage));
    case '/signin':
      return React.createElement(Redirect(SigninPage));
    case '/register':
      return React.createElement(Redirect(RegisterPage));
    default:
      return <LandingPage />;
  }
};

export default App;
