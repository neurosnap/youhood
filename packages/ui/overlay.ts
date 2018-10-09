import { connect } from 'react-redux';
import * as h from 'react-hyperscript';
import styled from 'styled-components';

import { selectors } from '@youhood/menu';
import { State } from '@youhood/web-app/types';
import { selectors as hoodSelectors } from '@youhood/hood';
const { getIsEditing } = hoodSelectors;

import HoodViewer from './hood-viewer';
import HoodSelector from './hood-selector';
import HoodEditor from './hood-editor';

const { isOverlayOpen } = selectors;

const OverlayOuter = styled.div`
  z-index: 314159;
  position: absolute;
  top: 56px;
  right: 0;
  width: 400px;
  height: 100%;
  background-color: #4285f4;
  transition: 0.2s linear;
  transform: ${(props: any) =>
    props.show ? 'translate3d(0, 0, 0)' : 'translate3d(400px, 0, 0)'};
`;

const OverlayInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.15);
  height: 100%;
`;

const Overlay = ({ show = false, isEditing = false }) =>
  h(OverlayOuter, <any>{ show }, [
    h(OverlayInner, [
      h(HoodSelector, { show }),
      isEditing ? h(HoodEditor) : h(HoodViewer),
    ]),
  ]);

export default connect((state: State) => ({
  show: isOverlayOpen(state),
  isEditing: getIsEditing(state),
}))(Overlay as any);
