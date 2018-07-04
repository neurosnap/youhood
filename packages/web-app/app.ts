import * as h from 'react-hyperscript';

import { smartComponents } from '@youhood/ui';
const { Overlay, Navbar, HoodBar } = smartComponents;

export default () =>
  h('div', [
    h(Overlay),
    h(Navbar),
    h(HoodBar),
  ]);
