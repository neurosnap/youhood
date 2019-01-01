import * as h from 'react-hyperscript';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { SFC } from 'react';

import { WebState } from '@youhood/types';
import { selectors } from '@youhood/token';
const { getIsUserLoggedIn } = selectors;
import theme from '@youhood/theme';

import { Link, NavRight, NavHover } from './ui';
import Signin from './signin';

const NavLink = styled(Link)`
  text-decoration: none;
`;

interface IProps {
  isUserLoggedIn: boolean;
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

const Navbar: SFC<IProps> = ({ isUserLoggedIn }) =>
  h(Nav, [
    h(NavView, [
      h(NavBrand, [h(NavLink, { href: '/' }, [h(Brand, 'YouHood')])]),
      h(NavMenu, [
        h(Hover, [h(NavLink, { href: '/explore' }, 'Explore')]),
        h(Hover, [h(NavLink, { href: '/docs' }, 'Docs')]),
        h(Hover, [h(NavLink, { href: '/pricing' }, 'Pricing')]),
        isUserLoggedIn
          ? h(Signin)
          : h(SignInLink, { href: '/signin' }, 'Sign In'),
      ]),
    ]),
  ]);

const mapState = (state: WebState) => {
  return {
    isUserLoggedIn: getIsUserLoggedIn(state),
  };
};
export default connect(mapState)(Navbar);
