import * as React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { SFC } from 'react';

import { WebState } from '@youhood/types';
import { selectors } from '@youhood/token';
const { getIsUserLoggedIn } = selectors;
import theme from '@youhood/theme';

import { Link, NavRight, NavHover } from './ui';
import UserMenu from './user-menu';

const NavLink = styled(Link)`
  text-decoration: none;
`;

interface IProps {
  isUserLoggedIn: boolean;
  style?: { [key: string]: string | number };
}

const Nav = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 56px;
  background-color: ${theme.palette.bg.primary};

  ${theme.responsive.mobile`
    margin-left: 20px;
  `}
`;

const NavView = styled.div`
  z-index: 1;
  width: 100%;
  max-width: 1040px;
  color: #fff;
  display: flex;
  align-items: center;
`;

const NavBrand = styled.div`
  display: flex;
  align-items: center;
`;

const Brand = styled.div`
  font-size: ${theme.font.size.header.large};
  font-weight: 400;
`;

const SignInLink = styled(NavLink)`
  border: 1px solid #fff;
  border-radius: 5px;
  margin: 0 0 0 1rem;
  padding: 0.3rem 0.7rem;
`;

const Hover = styled(NavHover)`
  margin: 0 1rem;
  padding: 0 0.5rem;
`;

const NavMenu = styled(NavRight)`
  ${theme.responsive.mobile`
    display: none;
  `}
`;

const Navbar: SFC<IProps> = ({ isUserLoggedIn, style = {} }) => (
  <Nav style={style}>
    <NavView>
      <NavBrand>
        <NavLink href="/" />
        <Brand>YouHood</Brand>
      </NavBrand>
      <NavMenu>
        <Hover>
          <NavLink href="/explore">Explore</NavLink>
        </Hover>
        <Hover>
          <NavLink href="/docs">Docs</NavLink>
        </Hover>
        <Hover>
          <NavLink href="/pricing">Pricing</NavLink>
        </Hover>
        {isUserLoggedIn ? (
          <UserMenu />
        ) : (
          <SignInLink href="/signin">Sign In</SignInLink>
        )}
      </NavMenu>
    </NavView>
  </Nav>
);

const mapState = (state: WebState) => {
  return {
    isUserLoggedIn: getIsUserLoggedIn(state),
  };
};
export default connect(mapState)(Navbar);
