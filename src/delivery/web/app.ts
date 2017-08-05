/* @flow */
import h from 'react-hyperscript';

import { OverlayConn } from './overlay';
import { Navbar } from './navbar';

export default () =>
  h('div', [
    h(OverlayConn),
    h(Navbar),
  ]);
