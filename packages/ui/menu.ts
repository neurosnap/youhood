import styled from 'styled-components';
import * as h from 'react-hyperscript';
import { Component } from 'react';

import { Menu } from './ui';

const OverlayOuter = styled.div`
  z-index: 314159;
  position: absolute;
  top: 56px;
  left: 0;
  width: 350px;
  height: 100%;
  background-color: #4285f4;
  transition: 0.2s linear;
  transform: ${(props: any) =>
    props.show ? 'translate3d(0, 0, 0)' : 'translate3d(-350px, 0, 0)'};
`;

const OverlayInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.15);
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
  color: #fff;

  :hover {
    background-color: rgba(255, 255, 255, 0.25);
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
      h(Menu, { onClick: this.toggle }, [h('i.fa.fa-bars.fa-lg')]),
      h(OverlayOuter, <any>{ show: this.state.show }, [
        h(OverlayInner, [
          h(Link, { href: '#' }, 'About'),
          h(Link, { href: '#' }, 'FAQ'),
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
        ]),
      ]),
    ]);
  }
}

export default MenuDrawer;
