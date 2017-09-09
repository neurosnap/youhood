import * as h from 'react-hyperscript';
import { Component } from 'react';
import { connect } from 'react-redux';

import { actionCreators, selectors as authSelectors } from '../../packages/auth';
const { signIn } = actionCreators;
const { getAuthError, isUserAuthenticated } = authSelectors;
import { selectors } from '../../packages/user';
const { getCurrentUserId, getCurrentUser } = selectors;
import { AuthPayload } from '../../packages/auth/action-creators';
import { State, UserId, AuthError, User } from '../../types';

import Profile from './profile';

interface Props {
  handleSignIn: Function;
  currentUserId: UserId;
  error: AuthError;
}

class SignInMenu extends Component {
  props: Props;

  state = {
    email: '',
    password: '',
  };

  handleEmail = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({ email: event.currentTarget.value });
  }

  handlePassword = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({ password: event.currentTarget.value });
  }

  login = () => {
    const { email, password } = this.state;
    const { handleSignIn, currentUserId } = this.props;
    handleSignIn({ email, password, currentUserId });
  }

  render() {
    const { email, password } = this.state;
    const { error } = this.props;

    return h('div.signin-menu-container', [
      h('div.signin-menu', [
        h('input.input', {
          type: 'text',
          placeholder: 'email address',
          value: email,
          onChange: this.handleEmail,
        }),
        h('input.input', {
          type: 'password',
          placeholder: 'password',
          value: password,
          onChange: this.handlePassword,
        }),
        h('div.error', error || '-'),
        h('div.buttons', [
          h('div.nav-hover.button', { onClick: this.login }, [
            h('div', 'Sign In'),
          ]),
          h('div.nav-hover.button', [
            h('div', 'Register'),
          ]),
        ]),
      ]),
    ]);
  }
}

const SignInMenuConn = connect(
  (state: State) => ({
    currentUserId: getCurrentUserId(state),
    error: getAuthError(state),
  }),
  (dispatch: Function) => ({
    handleSignIn: (payload: AuthPayload) => dispatch(signIn(payload)),
  }),
)(SignInMenu as any);

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
        menu = h(SignInMenuConn);
      }
    }

    return h('div.signin-container', { style: { position: 'relative' } }, [
      h('div.nav-hover', signinProps, [
        h('div.signin', [
          authenticated ? h('a', user.name) : h('a', 'Sign In'),
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
