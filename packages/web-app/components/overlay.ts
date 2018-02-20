import { connect } from 'react-redux';
import * as h from 'react-hyperscript';
import styled from 'styled-components';

import { selectors } from '@youhood/menu';

import { State } from '../types';
import HoodView from './hood';
import HoodSelection from './hood-selection';

const { isOverlayOpen } = selectors;

const OverlayContainer = styled.div`
  z-index: 314159;
  display: flex;
  position: absolute;
  top: 0;
  right: 10%;
  width: 15%;
  height: 100%;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const Overlay = (props: any) => 
  h(OverlayContainer, [
    h(HoodView, props),
    h(HoodSelection, props),
  ]);

export default connect(
  (state: State) => ({
    show: isOverlayOpen(state),
  }),
)(Overlay as any);
