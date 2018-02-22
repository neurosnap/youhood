import { connect } from 'react-redux';
import * as h from 'react-hyperscript';
import styled from 'styled-components';

import { selectors } from '@youhood/menu';

import { State } from '../types';
import HoodView from './hood';
import HoodSelection from './hood-selection';

const { isOverlayOpen } = selectors;

const OverlayOuter = styled.div`
  z-index: 314159;
  position: absolute;
  top: 56px;
  right: 0;
  width: 350px;
  height: 100%;
  background-color: #4285f4;
  transition: 0.2s linear;
  transform: ${(props: any) => 
    props.show ? 'translate3d(0, 0, 0)' : 'translate3d(350px, 0, 0)'};
`;

const OverlayInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.15);
  height: 100%;
`;

const Overlay = (props: any) => 
  h(OverlayOuter, props, [
    h(OverlayInner, [
      h(HoodSelection, props),
      h(HoodView, props),
    ]),
  ]);

export default connect(
  (state: State) => ({
    show: isOverlayOpen(state),
  }),
)(Overlay as any);
