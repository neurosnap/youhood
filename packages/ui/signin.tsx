import * as React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import { actions, selectors as authSelectors } from '@youhood/auth';
const { signIn } = actions;
const { getAuthError } = authSelectors;
import { selectors } from '@youhood/user';
const { getCurrentUserId } = selectors;
import { AuthPayload, AuthError } from '@youhood/auth/types';
import { WebState } from '@youhood/types';

import { ErrorText, Input, Buttons, SignInMenuEl, Button } from './ui';

type OnClick = (props: AuthPayload) => void;
interface IAuth {
  error: AuthError;
  onClick: OnClick;
  currentUserId: string;
}

interface IAuthState {
  email: string;
  password: string;
}

export class SignIn extends Component<IAuth, IAuthState> {
  static defaultProps: IAuth = {
    onClick: (p: AuthPayload) => {},
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
    const { error } = this.props;
    const shouldDisableButton = !email || !password;

    return (
      <SignInMenuEl>
        <Input
          className="signin-email"
          type="text"
          placeholder="email address"
          value={email}
          onChange={this.handleEmail}
        />
        <Input
          className="signin-pass"
          type="password"
          placeholder="password"
          value={password}
          onChange={this.handlePassword}
        />
        <Buttons>
          <Button
            className="signin-btn"
            onClick={this.handleClick}
            disabled={shouldDisableButton}
          >
            Sign In
          </Button>
        </Buttons>
        {error ? <ErrorText>{error}</ErrorText> : null}
      </SignInMenuEl>
    );
  }
}

const mapStateToProps = (state: WebState) => ({
  currentUserId: getCurrentUserId(state),
  error: getAuthError(state),
});

export default connect(
  mapStateToProps,
  (dispatch: Function) => ({
    onClick: (payload: AuthPayload) => dispatch(signIn(payload)),
  }),
)(SignIn);
