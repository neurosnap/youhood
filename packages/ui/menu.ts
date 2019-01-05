import styled from 'styled-components';
import * as h from 'react-hyperscript';
import { Component } from 'react';

import { Menu, Hamburger } from './ui';
import theme from '@youhood/theme';

const OverlayOuter = styled.div`
  z-index: 314159;
  position: absolute;
  top: 56px;
  left: 0;
  width: 350px;
  height: 100%;
  background-color: ${theme.palette.bg.primary};
  transition: 0.2s linear;
  transform: ${(props: any) =>
    props.show ? 'translate3d(0, 0, 0)' : 'translate3d(-350px, 0, 0)'};
`;

const OverlayInner = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${theme.palette.bg.input.normal};
  height: 100%;
  padding: 50px;
`;

const Link = styled.a`
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 10px;
  margin: 10px;
  text-decoration: none;
  color: ${theme.palette.font.primary};

  :hover {
    background-color: ${theme.palette.bg.input.hover};
  }
`;

class MenuDrawer extends Component {
  state = {
    show: false,
  };

  toggle = () => {
    this.setState({ show: !this.state.show });
  };

  render() {
    return h('div', [
      h(Menu, { onClick: this.toggle }, [h(Hamburger)]),
      h(OverlayOuter, <any>{ show: this.state.show }, [
        h(OverlayInner, [
          h(Link, { href: '/' }, 'Home'),
          h(Link, { href: '/docs' }, 'API Documentation'),
          h(Link, { href: '/pricing' }, 'Pricing'),
          h(
            Link,
            {
              href: 'https://github.com/neurosnap/youhood/issues',
              target: '_blank',
            },
            'Submit Feedback',
          ),
          h(
            Link,
            { href: 'https://github.com/neurosnap/youhood', target: '_blank' },
            'Source Code',
          ),
          h(
            Link,
            { href: 'mailto:support@youhood.io', target: '_blank' },
            'support@youhood.io',
          ),
        ]),
      ]),
    ]);
  }
}

export default MenuDrawer;
