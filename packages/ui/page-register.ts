import * as h from 'react-hyperscript';
import { Component } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { connect } from 'react-redux';

import theme from '@youhood/theme';
import { selectors } from '@youhood/token';
const { getIsUserLoggedIn } = selectors;
import { WebState } from '@youhood/types';

import Register from './register';
import { Brand, Link } from './ui';

const NavLink = styled(Link)`
  text-decoration: none;
`;

const Info = styled.div`
  display: flex;
  color: ${theme.palette.font.primary};
  font-size: ${theme.font.size.small};
  justify-content: center;
  align-items: center;
`;

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
  background: linear-gradient(150deg, #53f 5%, #05d5ff 60%, #a6ffcb 95%);
`;

const SignInInner = styled.div`
  width: 350px;
  height: 450px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  background-color: ${theme.palette.bg.primary};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  padding: 0.5rem;
  ${theme.responsive.mobile`
    width: 100%;
  `};
`;

const BrandView = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

interface IProps {
  isLoggedIn: boolean;
}

export class RegisterPage extends Component<IProps> {
  render() {
    return h('div', { style: { height: '100%' } }, [
      h(SignInView, [
        h(SignInInner, [
          h(BrandView, [h(NavLink, { href: '/' }, [h(Brand, 'YouHood')])]),
          h(Register),
          h(Info, [
            h('div', 'Already have an account?'),
            h(Link, { href: '/signin' }, 'Sign in'),
          ]),
        ]),
        h(PageGlobalStyle),
      ]),
    ]);
  }
}

const mapState = (state: WebState) => {
  return {
    isLoggedIn: getIsUserLoggedIn(state),
  };
};
export default connect(mapState)(RegisterPage);
