import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { actions } from '@youhood/hood';
const { showAllHoods, hideAllHoods, showOnlyWinnerHoods } = actions;

import { HoodBarButton } from './ui';

const Visible = styled.div`
  display: flex;
  margin-left: 0;
  position: relative;
  height: 100%;
`;

const noop = () => {};

type VisibleProp = () => void;
interface Props {
  showAll: VisibleProp;
  hideAll: VisibleProp;
  showWinners: VisibleProp;
}

export const HoodVisible: React.SFC<Props> = ({
  showAll,
  hideAll,
  showWinners,
}) => (
  <Visible>
    <HoodBarButton onClick={showWinners}>Show Current Hoods</HoodBarButton>
    <HoodBarButton onClick={showAll}>Show All Hoods</HoodBarButton>
    <HoodBarButton onClick={hideAll}>Hide All Hoods</HoodBarButton>
  </Visible>
);

HoodVisible.defaultProps = {
  showAll: noop,
  hideAll: noop,
};

export default connect(
  null,
  (dispatch) => ({
    showAll: () => dispatch(showAllHoods()),
    hideAll: () => dispatch(hideAllHoods()),
    showWinners: () => dispatch(showOnlyWinnerHoods()),
  }),
)(HoodVisible);
