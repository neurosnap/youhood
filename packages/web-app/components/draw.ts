import * as h from 'react-hyperscript';
import { connect } from 'react-redux';

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

const DrawHood = ({ handleDrawHood, handleCancelDrawHood, isEditing }: Props) => isEditing ?
  h(Button, { onClick: handleCancelDrawHood }, [
    h('div', 'Cancel'),
  ]) :
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
