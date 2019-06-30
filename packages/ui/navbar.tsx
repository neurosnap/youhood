import * as React from 'react';

import UserMenu from './user-menu';
import Points from './points';
import { Nav, NavContent, NavLeft, NavRight, Brand } from './ui';

import Menu from './menu';
import Search from './search';

interface Props {
  points?: number;
}

const Navbar: React.SFC<Props> = ({ points = 0 }) => (
  <Nav>
    <NavContent>
      <NavLeft>
        <Menu />
        <Brand>YouHood</Brand>
      </NavLeft>
      <NavRight>
        <Search />
        <Points points={points} />
        <UserMenu />
      </NavRight>
    </NavContent>
  </Nav>
);

export default Navbar;
