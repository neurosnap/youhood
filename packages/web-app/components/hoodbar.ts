import styled from 'styled-components';
import * as h from 'react-hyperscript';

import HoodVisible from './hood-visible';
import DrawHood from './draw';
import { HoodBarButton } from './ui';

const HoodBar = styled.div`
  background-color: #e8e8e8;
  border-bottom: 1px solid #ccc;
  height: 28px;
  padding: 2px 24px;
  display: flex;
`;

export default () => h(HoodBar, [
  h(HoodBarButton, [
    h(DrawHood),
  ]),
  h(HoodVisible),
]);
