import * as h from 'react-hyperscript';

import SignIn from './signin';
import Points from './points';
import { Nav, NavContent, NavLeft, NavRight, Brand } from './ui';

import Menu from './menu';
import Search from './search';

interface Props {
  points: number;
}

const Navbar: React.SFC<Props> = ({ points }) =>
  h(Nav, [
    h(NavContent, [
      h(NavLeft, [h(Menu), h(Brand, 'YouHood')]),
      h(NavRight, [h(Search), h(Points, { points }), h(SignIn)]),
    ]),
  ]);

Navbar.defaultProps = {
  points: 0,
};

export default Navbar;
