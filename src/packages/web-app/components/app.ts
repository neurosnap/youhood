import * as h from 'react-hyperscript';

import Overlay from './overlay';
import Navbar from './navbar';

export default () =>
  h('div', [
    h(Overlay),
    h(Navbar),
  ]);
