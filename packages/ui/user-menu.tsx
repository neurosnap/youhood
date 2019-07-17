import * as React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { selectors as tokenSelectors } from '@youhood/token';
const { getIsUserLoggedIn } = tokenSelectors;
import { selectors } from '@youhood/user';
const { getCurrentUser } = selectors;
import { User, WebState } from '@youhood/types';
import theme from '@youhood/theme';

import Profile from './profile';
import AuthMenu from './auth';
import { NavHover } from './ui';

export const View = styled.div`
  margin-left: 0;
  position: relative;
  height: 100%;
  outline: none;
`;

export const Inner = styled.div`
  text-decoration: none;
  color: ${theme.palette.font.primary};

  a {
    text-decoration: none;
    color: ${theme.palette.font.primary};
  }
`;

interface IProps {
  authenticated: boolean;
  user: User;
}

export class UserMenu extends Component<IProps> {
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

  componentWillReceiveProps(nextProps: IProps) {
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
        menu = <Profile />;
      } else {
        menu = <AuthMenu />;
      }
    }

    return (
      <View tabIndex={1} onBlur={this.onBlur}>
        <NavHover onClick={this.toggleMenu}>
          <Inner>{authenticated ? user.email : 'Sign In'}</Inner>
        </NavHover>
        {menu}
      </View>
    );
  }
}

const mapState = (state: WebState) => ({
  authenticated: getIsUserLoggedIn(state),
  user: getCurrentUser(state),
});

export default connect(mapState)(UserMenu);
