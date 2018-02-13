import * as h from 'react-hyperscript';
import { connect } from 'react-redux';

import { actionCreators } from '../../packages/hood';
const { drawHood } = actionCreators;

const DrawHood = ({ handleDrawHood }: { handleDrawHood: Function }) =>
  h('i.fa.fa-plus.fa-lg', { onClick: handleDrawHood });

export default connect(
  null,
  (dispatch) => ({
    handleDrawHood: () => dispatch(drawHood()),
  }),
)(DrawHood as any);
