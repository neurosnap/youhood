import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { selectors } from '@youhood/menu';
import { WebState } from '@youhood/types';
import { selectors as hoodSelectors } from '@youhood/hood';
const { getIsEditing } = hoodSelectors;

import HoodViewer from './hood-viewer';
import HoodSelector from './hood-selector';
import HoodEditor from './hood-editor';
import theme from '@youhood/theme';

const { isOverlayOpen } = selectors;

const OverlayOuter = styled.div`
  z-index: 314159;
  position: absolute;
  top: 56px;
  right: 0;
  width: 400px;
  height: 100%;
  background-color: ${theme.palette.bg.primary};
  transition: 0.2s linear;
  transform: ${(props: { show: boolean }) =>
    props.show ? 'translate3d(0, 0, 0)' : 'translate3d(400px, 0, 0)'};
`;

const OverlayInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${theme.palette.bg.input.normal};
  height: 100%;
`;

const Overlay = ({ show = false, isEditing = false }) => (
  <OverlayOuter show={show}>
    <OverlayInner>
      <HoodSelector show={show} />
      {isEditing ? <HoodEditor /> : <HoodViewer />}
    </OverlayInner>
  </OverlayOuter>
);

export default connect((state: WebState) => ({
  show: isOverlayOpen(state),
  isEditing: getIsEditing(state),
}))(Overlay);
