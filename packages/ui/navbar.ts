import * as h from 'react-hyperscript';

import SignIn from './signin';
import Points from './points';
import {
  Nav,
  NavContent,
  NavLeft,
  NavRight,
  Brand,
  Search,
  SearchIcon,
  SearchInput,
} from './ui';

import Menu from './menu';

interface Props {
  points: number;
}

export default ({ points }: Props) =>
  h(Nav, [
    h(NavContent, [
      h(NavLeft, [
        h(Menu),
        h(Brand, 'YouHood'),
      ]),
      h(NavRight, [
        h(Search, [
          h(SearchIcon, { className: 'fa fa-search' }),
          h(SearchInput, { placeholder: 'Search' }),
        ]),
        h(Points, { points }),
        h(SignIn),
      ]),
    ]),
  ]);
