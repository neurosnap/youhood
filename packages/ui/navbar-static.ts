import * as h from 'react-hyperscript';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { SFC } from 'react';

import { WebState } from '@youhood/types';
import { selectors } from '@youhood/token';
const { getIsUserLoggedIn } = selectors;

import {
  Link,
  Nav,
  NavContent,
  NavLeft,
  NavRight,
  Brand,
  NavHover,
} from './ui';
import Signin from './signin';

const NavLink = styled(Link)`
  text-decoration: none;
`;

interface IProps {
  isUserLoggedIn: boolean;
}

const Navbar: SFC<IProps> = ({ isUserLoggedIn }) =>
  h(Nav, [
    h(NavContent, [
      h(NavLeft, [h(NavLink, { href: '/' }, [h(Brand, 'YouHood')])]),
      h(NavRight, [
        h(NavHover, [h(NavLink, { href: '/' }, 'Explore')]),
        h(NavHover, [h(NavLink, { href: '/docs' }, 'Docs')]),
        h(NavHover, [h(NavLink, { href: '/pricing' }, 'Pricing')]),
        isUserLoggedIn
          ? h(Signin)
          : h(NavHover, [h(NavLink, { href: '/signin' }, 'Sign In')]),
      ]),
    ]),
  ]);

const mapState = (state: WebState) => {
  return {
    isUserLoggedIn: getIsUserLoggedIn(state),
  };
};
export default connect(mapState)(Navbar);
