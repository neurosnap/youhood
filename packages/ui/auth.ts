import * as h from 'react-hyperscript';
import { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { actions, selectors as authSelectors } from '@youhood/auth';
const { signIn, register } = actions;
const { getAuthError } = authSelectors;
import { selectors } from '@youhood/user';
const { getCurrentUserId } = selectors;
import { AuthPayload, AuthError } from '@youhood/auth/types';
import { UserId } from '@youhood/user/types';

import { State } from '@youhood/web-app/types';
import {
  DropdownMenuButton,
  ErrorText,
  Input,
  Buttons,
  SignInMenuEl,
  DropdownMenuContainer,
  SigninMsgBase,
} from './ui';

type OnClick = (props: AuthPayload) => void;
interface IAuth {
  error?: AuthError;
  children?: any;
  onClick: OnClick;
  currentUserId: UserId;
  buttonText: string;
}

interface IAuthState {
  email: string;
  password: string;
}

export class Auth extends Component<IAuth, IAuthState> {
  static defaultProps = {
    buttonText: '',
    onClick: () => {},
    currentUserId: '',
    error: '',
  };

  state = {
    email: '',
    password: '',
  };

  handleEmail = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({ email: event.currentTarget.value });
  };

  handlePassword = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({ password: event.currentTarget.value });
  };

  handleClick = () => {
    const { email, password } = this.state;
    const { onClick, currentUserId } = this.props;
    onClick({ email, password, currentUserId });
  };

  render() {
    const { email, password } = this.state;
    const { error, buttonText } = this.props;
    const shouldDisableButton = !email || !password;

    return h(SignInMenuEl, [
      h(Input, {
        className: 'signin-email',
        type: 'text',
        placeholder: 'email address',
        value: email,
        onChange: this.handleEmail,
      }),
      h(Input, {
        className: 'signin-pass',
        type: 'password',
        placeholder: 'password',
        value: password,
        onChange: this.handlePassword,
      }),
      error ? h(ErrorText, error) : h(SigninMsgBase),
      h(Buttons, [
        h(
          DropdownMenuButton,
          {
            className: 'signin-btn',
            onClick: this.handleClick,
            disabled: shouldDisableButton,
          },
          buttonText,
        ),
      ]),
    ]);
  }
}

interface IAuthMenu {
  error: AuthError;
  onClick: OnClick;
  currentUserId: UserId;
}

export const createAuthMenu = (buttonText: string) => ({
  onClick,
  currentUserId,
  error,
}: IAuthMenu) => h(Auth, { onClick, currentUserId, error, buttonText });

export const SignInMenu = createAuthMenu('Sign In');
export const RegisterMenu = createAuthMenu('Register');

const mapStateToProps = (state: State) => ({
  currentUserId: getCurrentUserId(state),
  error: getAuthError(state),
});

const createConnectForAuth = (component: any, action: Function) =>
  connect(
    mapStateToProps,
    (dispatch: Function) => ({
      onClick: (payload: AuthPayload) => dispatch(action(payload)),
    }),
  )(component as any);

export const SignInMenuConn = createConnectForAuth(SignInMenu, signIn);
export const RegisterMenuConn = createConnectForAuth(RegisterMenu, register);

type Tab = 'Sign In' | 'Register';
interface IAuthMenuState {
  tabSelected: Tab;
}

const TabSelected = styled.div`
  text-decoration: underline;
`;
const TabInactive = styled.div`
  cursor: pointer;
  color: #ccc;

  :hover {
    color: #fff;
  }
`;
const TabMenu = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 36px;
`;

export default class AuthMenu extends Component<null, IAuthMenuState> {
  state = {
    tabSelected: 'Sign In' as Tab,
  };

  setTab = (tab: Tab) => {
    const { tabSelected } = this.state;
    if (tab === tabSelected) return;
    this.setState({ tabSelected: tab });
  };

  render() {
    const { tabSelected } = this.state;
    const tabNames = ['Sign In', 'Register'];
    const tabs = tabNames.map((tab: Tab) => {
      const onClick = () => this.setTab(tab);
      const TabView = tab === tabSelected ? TabSelected : TabInactive;
      return h(TabView, { onClick, key: tab }, tab);
    });
    const Menu = tabSelected === 'Sign In' ? SignInMenuConn : RegisterMenuConn;

    return h(DropdownMenuContainer, [h(TabMenu, tabs), h(Menu)]);
  }
}
