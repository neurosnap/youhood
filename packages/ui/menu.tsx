import * as React from 'react';
import styled from 'styled-components';

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

class MenuDrawer extends React.Component {
  state = {
    show: false,
  };

  toggle = () => {
    this.setState({ show: !this.state.show });
  };

  render() {
    return (
      <div>
        <Menu onClick={this.toggle}>
          <Hamburger />
        </Menu>
        <OverlayOuter show={this.state.show}>
          <OverlayInner>
            <Link href="/">Home</Link>
            <Link href="/docs">API Documentation</Link>
            <Link href="/pricing">Pricing</Link>
            <Link
              href="https://github.com/neurosnap/youhood/issues"
              target="_blank"
            >
              Submit Feedback
            </Link>
            <Link href="https://github.com/neurosnap/youhood" target="_blank">
              Source Code
            </Link>
            <Link href="mailto:support@youhood.io" target="_blank">
              support@youhood.io
            </Link>
          </OverlayInner>
        </OverlayOuter>
      </div>
    );
  }
}

export default MenuDrawer;
