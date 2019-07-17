import * as React from 'react';

import Overlay from './overlay';
import Navbar from './navbar';
import HoodBar from './hoodbar';
import Onboard from './onboard';

export default () => (
  <React.Fragment>
    <Overlay />
    <Navbar />
    <HoodBar />
    <Onboard />
  </React.Fragment>
);
