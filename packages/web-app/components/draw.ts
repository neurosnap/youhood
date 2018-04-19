import * as h from 'react-hyperscript';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { actionCreators, selectors } from '@youhood/hood';
const { drawHood, cancelDrawHood } = actionCreators;
const { getIsEditing } = selectors;

interface Props {
  isEditing: boolean;
  handleCancelDrawHood: Function;
  handleDrawHood: Function;
}

const Button = styled.div`
  width: 71px;
  text-align: center;
`;

const DrawHood = ({ handleDrawHood, handleCancelDrawHood, isEditing }: Props) => isEditing ?
  h(Button, { onClick: handleCancelDrawHood }, 'Cancel') :
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
