import * as h from 'react-hyperscript';
import { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { actions, selectors as authSelectors } from '@youhood/auth';
const { register } = actions;
const { getAuthError } = authSelectors;
import { selectors } from '@youhood/user';
const { getCurrentUserId } = selectors;
import { AuthPayload, AuthError } from '@youhood/auth/types';
import { WebState } from '@youhood/types';

import { ErrorText, Input, Buttons, SignInMenuEl, Link, Button } from './ui';
import theme from '@youhood/theme';

const Terms = styled.div`
  display: flex;
  align-items: center;
  color: ${theme.palette.font.primary};
  font-size: ${theme.font.size.small};
  margin: 0.5rem 0.4rem;
  width: 90%;
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
`;

type OnClick = (props: AuthPayload) => void;
interface IAuth {
  error: AuthError;
  onClick: OnClick;
  currentUserId: string;
}

interface IAuthState {
  email: string;
  password: string;
  passwordConfirm: string;
  acceptTerms: boolean;
}

export class Register extends Component<IAuth, IAuthState> {
  static defaultProps = {
    onClick: () => {},
    currentUserId: '',
    error: '',
  };

  state = {
    email: '',
    password: '',
    passwordConfirm: '',
    acceptTerms: false,
  };

  handleEmail = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({ email: event.currentTarget.value });
  };

  handlePassword = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({ password: event.currentTarget.value });
  };

  handlePasswordConfirm = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({ passwordConfirm: event.currentTarget.value });
  };

  handleAcceptTerms = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({ acceptTerms: event.currentTarget.checked });
  };

  handleClick = () => {
    const { email, password } = this.state;
    const { onClick, currentUserId } = this.props;
    onClick({ email, password, currentUserId });
  };

  render() {
    const { email, password, passwordConfirm, acceptTerms } = this.state;
    const { error } = this.props;
    const shouldDisableButton =
      !email ||
      !password ||
      !passwordConfirm ||
      !acceptTerms ||
      password !== passwordConfirm;

    return h(SignInMenuEl, [
      h(Input, {
        className: 'register-email',
        type: 'text',
        placeholder: 'email address',
        value: email,
        onChange: this.handleEmail,
      }),
      h(Input, {
        className: 'register-pass',
        type: 'password',
        placeholder: 'password',
        value: password,
        onChange: this.handlePassword,
      }),
      h(Input, {
        className: 'register-pass-confirm',
        type: 'password',
        placeholder: 'confirm password',
        value: passwordConfirm,
        onChange: this.handlePasswordConfirm,
      }),
      h(Terms, [
        h(Checkbox, {
          id: 'terms',
          type: 'checkbox',
          checked: acceptTerms,
          onChange: this.handleAcceptTerms,
        }),
        h(
          'label',
          {
            for: 'terms',
          },
          [
            h('span', 'I accept the'),
            h(Link, { href: '/tos', target: '_blank' }, 'Terms of Service'),
            h('span', ' and '),
            h(Link, { href: '/privacy', target: '_blank' }, 'Privacy Policy'),
          ],
        ),
      ]),
      h(Buttons, [
        h(
          Button,
          {
            className: 'register-btn',
            onClick: this.handleClick,
            disabled: shouldDisableButton,
          },
          'Register',
        ),
      ]),
      error ? h(ErrorText, error) : null,
    ]);
  }
}

const mapStateToProps = (state: WebState) => ({
  currentUserId: getCurrentUserId(state),
  error: getAuthError(state),
});

export default connect(
  mapStateToProps,
  (dispatch: Function) => ({
    onClick: (payload: AuthPayload) => dispatch(register(payload)),
  }),
)(Register);
