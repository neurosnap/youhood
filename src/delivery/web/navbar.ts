import { Component } from 'react';
import * as h from 'react-hyperscript';
import { connect } from 'react-redux';

import { State } from '../../types';
import { selectors } from '../../packages/point';
const { getTotalPoints } = selectors;

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
        h('div.search', [
          h('i.fa.fa-search'),
          h('input.search-input', { placeholder: 'Search' }),
        ]),
        h('div.points-container.nav-hover', [
          h(PointsConn, { points }),
        ]),
        h('div.sign-in-container.nav-hover', [
          h(SignIn),
        ]),
      ]),
    ]),
  ]);

const Points = ({ points }: Props) => {
  if (points === 0) {
    return h('i.fa.fa-trophy.fa-lg');
  }

  return h('span.points', `+${points}`);
};

const PointsConn = connect(
  (state: State) => ({
    points: getTotalPoints(state),
  }),
)(Points as any);

class SignIn extends Component {
  state = {
    open: false,
  };

  toggleMenu = () => {
    this.setState({ open: !this.state.open });
  }

  render() {
    const { open } = this.state;
    return h('div.sign-in', [
      h('a', { href: '#', onClick: this.toggleMenu }, 'Sign In'),
      open ? h(SignInMenu) : null,
    ]);
  }
}

const SignInMenu = () => h('div', 'Hi');
