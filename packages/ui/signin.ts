import * as h from 'react-hyperscript';
import { Component } from 'react';
import { connect } from 'react-redux';

import { selectors as authSelectors } from '@youhood/auth';
const { isUserAuthenticated } = authSelectors;
import { selectors } from '@youhood/user';
const { getCurrentUser } = selectors;
import { User } from '@youhood/user/types';

import { State } from '@youhood/web-app/types';
import Profile from './profile';
import AuthMenu from './auth';
import { NavHover, SignInContainer, SignInEl } from './ui';

interface SignInProps {
  authenticated: boolean;
  user: User;
}

export class SignIn extends Component {
  props: SignInProps;

  state = {
    open: false,
  };

  toggleMenu = () => {
    this.setState({ open: !this.state.open });
  };

  componentWillReceiveProps(nextProps: SignInProps) {
    const justSignedIn =
      this.props.authenticated === false && nextProps.authenticated === true;

    const justSignedOut =
      this.props.authenticated === true && nextProps.authenticated === false;

    if (justSignedIn || justSignedOut) {
      this.setState({ open: false });
    }
  }

  render() {
    const { open } = this.state;
    const { authenticated, user } = this.props;

    const signinProps = {
      href: '#',
      onClick: this.toggleMenu,
      tabIndex: 0,
      onBlur: open ? this.toggleMenu : () => {},
    };

    let menu = null;
    if (open) {
      if (authenticated) {
        menu = h(Profile);
      } else {
        menu = h(AuthMenu);
      }
    }

    return h(SignInContainer, { style: { position: 'relative' } }, [
      h(NavHover, signinProps, [
        h(SignInEl, [authenticated ? h('a', user.email) : h('a', 'Sign In')]),
      ]),
      menu,
    ]);
  }
}

export default connect((state: State) => ({
  authenticated: isUserAuthenticated(state),
  user: getCurrentUser(state),
}))(SignIn as any);
