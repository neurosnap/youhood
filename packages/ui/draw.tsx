import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { actions, selectors } from '@youhood/hood';
const { drawHood, cancelDrawHood } = actions;
const { getIsEditing } = selectors;
import { selectors as authSelectors } from '@youhood/token';
const { getIsUserLoggedIn } = authSelectors;
import { WebState } from '@youhood/types';

import { HoodBarButton } from './ui';

const Button = styled(HoodBarButton)`
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
export const Cancel: React.SFC<ICancel> = ({ cancelDraw }) => (
  <div>
    <Button onClick={cancelDraw}>Cancel</Button>
    <Overlay onClick={cancelDraw} />
  </div>
);

type CancelFn = (event: React.MouseEvent<HTMLElement>) => void;
interface IState {
  isUserLoggedIn: boolean;
  isEditing: boolean;
}
interface IDispatch {
  handleCancelDrawHood: () => any;
  handleDrawHood: () => any;
}
interface Props extends IState, IDispatch {}

export const DrawHood: React.SFC<Props> = ({
  handleDrawHood,
  handleCancelDrawHood,
  isEditing = false,
  isUserLoggedIn = false,
}) => {
  if (!isUserLoggedIn) {
    return null;
  }

  if (isEditing) {
    return <Cancel cancelDraw={handleCancelDrawHood} />;
  }

  return <Button onClick={handleDrawHood}>Create Hood</Button>;
};

export default connect(
  (state: WebState) => ({
    isEditing: getIsEditing(state),
    isUserLoggedIn: getIsUserLoggedIn(state),
  }),
  (dispatch) => ({
    handleDrawHood: () => dispatch(drawHood()),
    handleCancelDrawHood: () => dispatch(cancelDrawHood()),
  }),
)(DrawHood);
