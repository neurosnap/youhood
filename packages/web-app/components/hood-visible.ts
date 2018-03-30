import * as h from 'react-hyperscript';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { actionCreators } from '@youhood/hood';
const { showAllHoods, hideAllHoods } = actionCreators;

import { NavHover } from './ui';

const Visible = styled.div`
  display: flex;
  margin-left: 0;
  position: relative;
  height: 100%;
`;

interface Visible {
  (): void;
}

interface Props {
  showAll: Visible;
  hideAll: Visible;
}

const HoodVisible = ({ showAll, hideAll }: Props) => h(Visible, [
  h(NavHover, { onClick: showAll }, 'Show Hoods'),
  h(NavHover, { onClick: hideAll }, 'Hide Hoods'),
]);

export default connect(null, (dispatch) => ({
  showAll: () => dispatch(showAllHoods()),
  hideAll: () => dispatch(hideAllHoods()),
}))(HoodVisible as any);

