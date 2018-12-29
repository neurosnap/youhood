import * as h from 'react-hyperscript';
import { Fragment } from 'react';

import Overlay from './overlay';
import Navbar from './navbar';
import HoodBar from './hoodbar';
import Onboard from './onboard';

export default () =>
  h(Fragment, [h(Overlay), h(Navbar), h(HoodBar), h(Onboard)]);
