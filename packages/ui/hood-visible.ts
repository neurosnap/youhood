import * as h from 'react-hyperscript';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { actions } from '@youhood/hood';
const { showAllHoods, hideAllHoods } = actions;

import { HoodBarButton } from './ui';

const Visible = styled.div`
  display: flex;
  margin-left: 0;
  position: relative;
  height: 100%;
`;

const noop = () => {};

interface VisibleProp {
  (): void;
}

interface Props {
  showAll: VisibleProp;
  hideAll: VisibleProp;
}

export const HoodVisible: React.SFC<Props> = ({ showAll, hideAll }) =>
  h(Visible, [
    h(HoodBarButton, { onClick: showAll }, 'Show Hoods'),
    h(HoodBarButton, { onClick: hideAll }, 'Hide Hoods'),
  ]);

HoodVisible.defaultProps = {
  showAll: noop,
  hideAll: noop,
};

export default connect(
  null,
  (dispatch) => ({
    showAll: () => dispatch(showAllHoods()),
    hideAll: () => dispatch(hideAllHoods()),
  }),
)(HoodVisible as any);
