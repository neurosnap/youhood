import * as h from 'react-hyperscript';
import { Component } from 'react';
import styled from 'styled-components';

import theme from '@youhood/theme';

import { DropdownMenuContainer } from './ui';
import SignIn from './signin';
import Register from './register';

type Tab = 'Sign In' | 'Register';
interface IAuthMenuState {
  tabSelected: Tab;
}

const TabSelected = styled.div`
  color: ${theme.palette.font.primary};
  text-decoration: underline;
`;
const TabInactive = styled.div`
  cursor: pointer;
  color: ${theme.palette.font.disabled};

  :hover {
    color: ${theme.palette.font.primary};
  }
`;
const TabMenu = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 36px;
`;

export class AuthMenu extends Component<any, IAuthMenuState> {
  state = {
    tabSelected: 'Sign In' as Tab,
  };

  setTab = (tab: Tab) => {
    const { tabSelected } = this.state;
    if (tab === tabSelected) return;
    this.setState({ tabSelected: tab });
  };

  render() {
    const { tabSelected } = this.state;
    const tabNames: Tab[] = ['Sign In', 'Register'];
    const tabs = tabNames.map((tab: Tab) => {
      const onClick = () => this.setTab(tab);
      const TabView = tab === tabSelected ? TabSelected : TabInactive;
      return h(TabView, { onClick, key: tab }, tab);
    });
    const Menu = tabSelected === 'Sign In' ? SignIn : Register;

    return h('div', [h(TabMenu, tabs), h(Menu)]);
  }
}

export default () => {
  return h(DropdownMenuContainer, [h(AuthMenu)]);
};
