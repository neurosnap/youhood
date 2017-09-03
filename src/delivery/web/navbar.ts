import { Component } from 'react';
import * as h from 'react-hyperscript';
import { connect } from 'react-redux';

import { State, Points } from '../../types';
import { selectors } from '../../packages/point';
const { getTotalPoints } = selectors;

interface Props {
  points: Points;
}

export const Navbar = ({ points }: Props) =>
  h('div.nav', [
    h('div.nav-content', [
      h('div.nav-left', [
        h('i.material-icons.icon', 'menu'),
        h('div.brand', 'YouHood'),
      ]),
      h('div.nav-right', [
        h('div.search', [
          h('i.material-icons.search-icon', 'search'),
          h('input.search-input', { placeholder: 'Search' }),
        ]),
        h('div.points-container', [
          h('i.material-icons.icon', 'whatshot'),
          h('span.points', points),
        ]),
        h(SignIn),
      ]),
    ]),
  ]);

export default connect(
  (state: State) => ({
    points: getTotalPoints(state),
  }),
)(Navbar as any);

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
