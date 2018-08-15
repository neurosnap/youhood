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

  onBlur = (ev: any, doc: any = document) => {
    if (!this.state.open) return;

    const parentEl = ev.currentTarget;
    setTimeout(() => {
      const clickedEl = doc.activeElement;
      if (!parentEl.contains(clickedEl)) this.setState({ open: false });
    }, 0);
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

    let menu = null;
    if (open) {
      if (authenticated) {
        menu = h(Profile);
      } else {
        menu = h(AuthMenu);
      }
    }

    return h(SignInContainer, { tabIndex: 1, onBlur: this.onBlur }, [
      h(NavHover, { onClick: this.toggleMenu }, [
        h(SignInEl, authenticated ? user.email : 'Sign In'),
      ]),
      menu,
    ]);
  }
}

export default connect((state: State) => ({
  authenticated: isUserAuthenticated(state),
  user: getCurrentUser(state),
}))(SignIn as any);
