import * as h from 'react-hyperscript';

import Overlay from './overlay';
import Navbar from './navbar';
import HoodBar from './hoodbar';

export default () =>
  h('div', [
    h(Overlay),
    h(Navbar),
    h(HoodBar),
  ]);
