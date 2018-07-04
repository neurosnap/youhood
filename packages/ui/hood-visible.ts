import * as h from 'react-hyperscript';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { actionCreators } from '@youhood/hood';
const { showAllHoods, hideAllHoods } = actionCreators;

import { HoodBarButton } from './ui';

const Visible = styled.div`
  display: flex;
  margin-left: 0;
  position: relative;
  height: 100%;
`;

interface VisibleProp {
  (): void;
}

interface Props {
  showAll: VisibleProp;
  hideAll: VisibleProp;
}

export const HoodVisible = ({ showAll, hideAll }: Props) => h(Visible, [
  h(HoodBarButton, { onClick: showAll }, 'Show Hoods'),
  h(HoodBarButton, { onClick: hideAll }, 'Hide Hoods'),
]);

export default connect(null, (dispatch) => ({
  showAll: () => dispatch(showAllHoods()),
  hideAll: () => dispatch(hideAllHoods()),
}))(HoodVisible as any);

