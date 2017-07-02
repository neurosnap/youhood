/* @flow */
import { Component } from 'react';
import ReactDOM from 'react-dom';
import h from 'react-hyperscript';

export const Navbar = () =>
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
      h('i.material-icons.icon', 'whatshot'),
      h(SignIn),
    ]),
  ]);

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

export function renderNavbar(props: Object = {}) {
  ReactDOM.render(
    h(Navbar, props),
    document.querySelector('.nav'),
  );
}
