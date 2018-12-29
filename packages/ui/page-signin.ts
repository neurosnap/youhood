import * as h from 'react-hyperscript';
import { Component } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { connect } from 'react-redux';

import theme from '@youhood/theme';
import { selectors } from '@youhood/token';
const { getIsUserLoggedIn } = selectors;
import { WebState } from '@youhood/types';

import NavbarStatic from './navbar-static';
import { AuthMenu } from './auth';

const PageGlobalStyle = createGlobalStyle`
  #app {
    height: 100%;
  }
`;

const SignInView = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: ${theme.palette.bg.accent};
`;

const SignInContainer = styled.div`
  width: 350px;
  height: 400px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  background-color: rgba(71, 135, 237, 0.8);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  ${theme.responsive.mobile`
    width: 100%;
  `};
`;

interface IProps {
  isLoggedIn: boolean;
}

export class SigninPage extends Component<IProps> {
  render() {
    return h('div', { style: { height: '100%' } }, [
      h(NavbarStatic),
      h(SignInView, [h(SignInContainer, [h(AuthMenu)]), h(PageGlobalStyle)]),
    ]);
  }
}

const mapState = (state: WebState) => {
  return {
    isLoggedIn: getIsUserLoggedIn(state),
  };
};
export default connect(mapState)(SigninPage);
