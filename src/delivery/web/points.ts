import * as h from 'react-hyperscript';
import { connect } from 'react-redux';

import { State } from '../../types';
import { selectors } from '../../packages/point';
const { getTotalPoints } = selectors;

interface Props {
  points: number;
}

const Points = ({ points }: Props) => {
  if (points === 0) {
    return h('i.fa.fa-trophy.fa-lg');
  }

  return h('span.points', `+${points}`);
};

export default connect(
  (state: State) => ({
    points: getTotalPoints(state),
  }),
)(Points as any);
