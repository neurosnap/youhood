import * as h from 'react-hyperscript';
import styled from 'styled-components';

import { Link, Nav, NavContent, NavLeft, Brand } from './ui';

const NavLink = styled(Link)`
  text-decoration: none;
  color: #000;
`;

const NavInv = styled(Nav)`
  position: fixed;
  top: 0;
  background-color: transparent;

  @media only screen and (max-width: 760px) {
    position: inherit;
  }
`;

const Navbar = () =>
  h(NavInv, [
    h(NavContent, [
      h(NavLeft, [h(NavLink, { href: '/' }, [h(Brand, 'YouHood api')])]),
    ]),
  ]);

export default Navbar;
