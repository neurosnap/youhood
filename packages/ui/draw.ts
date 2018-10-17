import * as h from 'react-hyperscript';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { actions, selectors } from '@youhood/hood';
const { drawHood, cancelDrawHood } = actions;
const { getIsEditing } = selectors;
import { selectors as authSelectors } from '@youhood/auth';
const { isUserAuthenticated } = authSelectors;

import { HoodBarButton } from './ui';

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

interface ICancel {
  cancelDraw: CancelFn;
}
export const Cancel: React.SFC<ICancel> = ({ cancelDraw }) =>
  h('div', [
    h(Button, { onClick: cancelDraw }, [h('div', 'Cancel')]),
    h(Overlay, { onClick: cancelDraw }),
  ]);

type CancelFn = (event: React.MouseEvent<HTMLElement>) => void;
interface IState {
  isUserLoggedIn: boolean;
  isEditing: boolean;
}
interface IDispatch {
  handleCancelDrawHood: CancelFn;
  handleDrawHood: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
interface Props extends IState, IDispatch {}

export const DrawHood: React.SFC<Props> = ({
  handleDrawHood,
  handleCancelDrawHood,
  isEditing,
  isUserLoggedIn,
}) => {
  if (!isUserLoggedIn) {
    return null;
  }

  return isEditing
    ? h(Cancel, { cancelDraw: handleCancelDrawHood })
    : h(Button, { onClick: handleDrawHood }, 'Create Hood');
};

export default connect<IState, IDispatch>(
  (state) => ({
    isEditing: getIsEditing(state),
    isUserLoggedIn: isUserAuthenticated(state),
  }),
  (dispatch) => ({
    handleDrawHood: () => dispatch(drawHood()),
    handleCancelDrawHood: () => dispatch(cancelDrawHood()),
  }),
)(DrawHood);
