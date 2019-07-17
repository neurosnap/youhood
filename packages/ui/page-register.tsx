import * as React from 'react';
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

export const RegisterPage: React.SFC<IProps> = () => (
  <div style={{ height: '100%' }}>
    <SignInView>
      <SignInInner>
        <BrandView>
          <NavLink href="/">
            <Brand>YouHood</Brand>
          </NavLink>
        </BrandView>
        <Register />
        <Info>
          <div>Already have an account?</div>
          <Link href="/signin">Sign In</Link>
        </Info>
      </SignInInner>
      <PageGlobalStyle />
    </SignInView>
  </div>
);

const mapState = (state: WebState) => {
  return {
    isLoggedIn: getIsUserLoggedIn(state),
  };
};
export default connect(mapState)(RegisterPage);
