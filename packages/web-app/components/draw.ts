import * as h from 'react-hyperscript';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { actionCreators, selectors } from '@youhood/hood';
const { drawHood, cancelDrawHood } = actionCreators;
const { getIsEditing } = selectors;

import { HoodBarButton } from './ui';

interface Props {
  isEditing: boolean;
  handleCancelDrawHood: Function;
  handleDrawHood: Function;
}

const Button = HoodBarButton.extend`
  width: 91px;
  display: flex;
  justify-content: center;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 56px;
  background-color: rgba(0, 0, 0, 0);
  cursor: pointer;
`;

const Cancel = ({ cancelDraw }: { cancelDraw: Function }) =>
  h('div', [
    h(Button, { onClick: cancelDraw }, [
      h('div', 'Cancel'),
    ]),
    h(Overlay, { onClick: cancelDraw }),
  ]);

const DrawHood = ({ handleDrawHood, handleCancelDrawHood, isEditing }: Props) => isEditing ?
  h(Cancel, { cancelDraw: handleCancelDrawHood }) :
  h(Button, { onClick: handleDrawHood }, 'Create Hood');

export default connect(
  (state) => ({
    isEditing: getIsEditing(state),
  }),
  (dispatch) => ({
    handleDrawHood: () => dispatch(drawHood()),
    handleCancelDrawHood: () => dispatch(cancelDrawHood()),
  }),
)(DrawHood as any);
