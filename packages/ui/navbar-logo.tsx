import * as React from 'react';
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

const Navbar = () => (
  <NavInv>
    <NavContent>
      <NavLeft>
        <NavLink href="/">
          <Brand>YouHood api</Brand>
        </NavLink>
      </NavLeft>
    </NavContent>
  </NavInv>
);

export default Navbar;
