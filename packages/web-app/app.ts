import * as h from 'react-hyperscript';
import { hot } from 'react-hot-loader';

import { smartComponents } from '@youhood/ui';
const { Overlay, Navbar, HoodBar } = smartComponents;

export default hot(module)(() => h('div', [h(Overlay), h(Navbar), h(HoodBar)]));
