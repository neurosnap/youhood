import * as h from 'react-hyperscript';

import SignIn from './signin';
import Points from './points';
import DrawHood from './draw';
import HoodVisible from './hood-visible';
import {
  NavHover,
  Nav,
  NavContent,
  NavLeft,
  NavRight,
  Menu,
  Brand,
  Search,
  SearchIcon,
  SearchInput,
} from './ui';

interface Props {
  points: number;
}

export default ({ points }: Props) =>
  h(Nav, [
    h(NavContent, [
      h(NavLeft, [
        h(Menu, [
          h('i.fa.fa-bars.fa-lg'),
        ]),
        h(Brand, 'YouHood'),
      ]),
      h(NavRight, [
        h(NavHover, [
          h(DrawHood),
        ]),
        h(Search, [
          h(SearchIcon, { className: 'fa fa-search' }),
          h(SearchInput, { placeholder: 'Search' }),
        ]),
        h(Points, { points }),
        h(SignIn),
        h(HoodVisible),
      ]),
    ]),
  ]);
