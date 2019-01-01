import * as h from 'react-hyperscript';
import styled from 'styled-components';

import theme from '@youhood/theme';

import NavbarStatic from './navbar-static';
import Footer from './footer';

export const Header = styled.h1`
  font-size: ${theme.font.size.header.large};
  font-weight: 300;

  ${theme.responsive.mobile`
    font-size: 2rem;
  `}
`;

const View = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
  color: #000;
`;

const Content = styled.div`
  margin-top: 20px;
`;

const ContentView = styled.div`
  max-width: 1040px;
  width: 100%;
  height: 650px;
  display: flex;
  flex-direction: column;
  margin-top: 20px;

  ${theme.responsive.mobile`
    height: 450px;
  `}
`;

export default () => {
  return h('div', [
    h(NavbarStatic),
    h(View, [
      h(ContentView, [
        h(Header, 'Pricing'),
        h(Content, 'Pricing to be determined at a later date.'),
      ]),
    ]),
    h(Footer),
  ]);
};
