import * as h from 'react-hyperscript';
import { connect } from 'react-redux';
import { Component } from 'react';

import { selectors } from '@youhood/point';
const { getTotalPoints, getPoints } = selectors;
import { Points } from '@youhood/point/types';

import { State } from '../types';

const DropMenu = ({ open = false, items = [] }: { open: boolean, items: any[] }) => {
  if (!open) {
    return null;
  }

  const HistoryItems = items.map((item) => {
    return h('div', `${item.value} -- ${item.reason}`);
  });

  return h('div.points-menu-container', [
    h('div.signin-menu', [
      items.length === 0 ? h('div', 'Start getting points!') : HistoryItems,
    ]),
  ]);
};

interface Props {
  points: number;
  pointHistory: Points;
}

class PointsView extends Component {
  props: Props;

  static defaultProps: Props = {
    points: 0,
    pointHistory: [],
  };

  state = {
    open: false,
  };

  toggleMenu = () => {
    this.setState({
      open: !this.state.open,
    });
  }

  render() {
    const { points, pointHistory } = this.props;
    const { open } = this.state;

    let Icon = h('span.points', { onClick: this.toggleMenu }, `+${points}`);
    if (points === 0) {
      Icon = h('i.fa.fa-trophy.fa-lg', { onClick: this.toggleMenu });
    }

    return h('div.nav-hover', { style: { position: 'relative' } }, [
      h('div.points-container', [
        Icon,
      ]),
      h(DropMenu, { open, items: pointHistory }),
    ]);
  }
} 

export default connect(
  (state: State) => ({
    points: getTotalPoints(state),
    pointHistory: getPoints(state),
  }),
)(PointsView as any);
