import * as h from 'react-hyperscript';

import SignIn from './signin';
import Points from './points';
import DrawHood from './draw';

interface Props {
  points: number;
}

export default ({ points }: Props) =>
  h('div.nav', [
    h('div.nav-content', [
      h('div.nav-left', [
        h('.nav-hover.menu', [
          h('i.fa.fa-bars.fa-lg'),
        ]),
        h('div.brand', 'YouHood'),
      ]),
      h('div.nav-right', [
        h('div.nav-hover', [
          h(DrawHood),
        ]),
        h('div.search', [
          h('i.fa.fa-search'),
          h('input.search-input', { placeholder: 'Search' }),
        ]),
        h('div.points-container.nav-hover', [
          h(Points, { points }),
        ]),
        h(SignIn),
      ]),
    ]),
  ]);
