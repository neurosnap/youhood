import * as h from 'react-hyperscript';
import { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { selectors as authSelectors } from '@youhood/auth';
const { isUserAuthenticated } = authSelectors;
import { selectors } from '@youhood/user';
const { getCurrentUser } = selectors;
import { User } from '@youhood/user/types';

import { State } from '../types';
import Profile from './profile';
import SignInMenu from './signin-menu';
import { NavHover } from './ui';

interface SignInProps {
  authenticated: boolean;
  user: User;
}


const SignInContainer = styled.div`
  margin-left: 0;
  position: relative;
  height: 100%;
`;

const SignInEl = styled.div`
  text-decoration: none;
  color: #fff;

  a {
    text-decoration: none;
    color: #fff;
  }
`;

export class SignIn extends Component {
  props: SignInProps;

  state = {
    open: false,
  };

  toggleMenu = () => {
    this.setState({ open: !this.state.open });
  }

  componentWillReceiveProps(nextProps: SignInProps) {
    const justSignedIn = (
      this.props.authenticated === false
      && nextProps.authenticated === true
    );

    const justSignedOut = (
      this.props.authenticated === true
      && nextProps.authenticated === false
    );

    if (justSignedIn || justSignedOut) {
      this.setState({ open: false });
    }
  }

  render() {
    const { open } = this.state;
    const { authenticated, user } = this.props;

    const signinProps = { href: '#', onClick: this.toggleMenu };

    let menu = null;
    if (open) {
      if (authenticated) {
        menu = h(Profile);
      } else {
        menu = h(SignInMenu);
      }
    }

    return h(SignInContainer, { style: { position: 'relative' } }, [
      h(NavHover, signinProps, [
        h(SignInEl, [
          authenticated ? h('a', user.email) : h('a', 'Sign In'),
        ]),
      ]),
      menu,
    ]);
  }
}

export default connect((state: State) => ({
  authenticated: isUserAuthenticated(state),
  user: getCurrentUser(state),
}))(SignIn as any);
