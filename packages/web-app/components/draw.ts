import * as h from 'react-hyperscript';
import { connect } from 'react-redux';

import { actionCreators } from '@youhood/hood';
const { drawHood } = actionCreators;

const DrawHood = ({ handleDrawHood }: { handleDrawHood: Function }) =>
  h('div', { onClick: handleDrawHood }, 'Create');

export default connect(
  null,
  (dispatch) => ({
    handleDrawHood: () => dispatch(drawHood()),
  }),
)(DrawHood as any);
