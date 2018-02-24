import * as h from 'react-hyperscript';
import { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { actionCreators, selectors as authSelectors } from '@youhood/auth';
const { signIn, register } = actionCreators;
const { getAuthError } = authSelectors;
import { selectors } from '@youhood/user';
const { getCurrentUserId } = selectors;
import { AuthPayload, AuthError } from '@youhood/auth/types';
import { UserId } from '@youhood/user/types';

import { State } from '../types';
import { NavHover, ErrorText, Input, Buttons, SignInMenuEl } from './ui';

const SignInButton = NavHover.extend`
  height: 36px;
`;

const SignInMenuContainer = styled.div`
  position: absolute;
  background: #4285f4;
  top: 46px;
  right: 9px;
  z-index: 401;
  width: 300px;
  height: 230px;
`;

interface Props {
  handleSignIn: Function;
  handleRegister: Function;
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

  register = () => {
    const { email, password } = this.state;
    const { handleRegister, currentUserId } = this.props;
    handleRegister({ email, password, currentUserId });
  }

  render() {
    const { email, password } = this.state;
    const { error } = this.props;

    return h(SignInMenuContainer, [
      h(SignInMenuEl, [
        h(Input, {
          type: 'text',
          placeholder: 'email address',
          value: email,
          onChange: this.handleEmail,
        }),
        h(Input, {
          type: 'password',
          placeholder: 'password',
          value: password,
          onChange: this.handlePassword,
        }),
        h(ErrorText, error || '-'),
        h(Buttons, [
          h(SignInButton, { onClick: this.login }, [
            h('div', 'Sign In'),
          ]),
          h(SignInButton, { onClick: this.register }, [
            h('div', 'Register'),
          ]),
        ]),
      ]),
    ]);
  }
}

export default connect(
  (state: State) => ({
    currentUserId: getCurrentUserId(state),
    error: getAuthError(state),
  }),
  (dispatch: Function) => ({
    handleSignIn: (payload: AuthPayload) => dispatch(signIn(payload)),
    handleRegister: (payload: AuthPayload) => dispatch(register(payload)),
  }),
)(SignInMenu as any);
