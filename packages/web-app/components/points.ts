import * as h from 'react-hyperscript';
import { connect } from 'react-redux';
import { Component } from 'react';
import styled from 'styled-components';

import { selectors } from '@youhood/point';
const { getTotalPoints, getPoints } = selectors;
import { Points } from '@youhood/point/types';

import { State } from '../types';
import { NavHover, SignInMenuEl } from './ui';

const PointsMenuContainer = styled.div`
  position: absolute;
  background: #4285f4;
  top: 46px;
  right: -2px;
  z-index: 401;
  width: 300px;
  height: 230px;
`;

const DropMenu = ({ open = false, items = [] }: { open: boolean, items: any[] }) => {
  if (!open) {
    return null;
  }

  const HistoryItems = items.map((item) => {
    return h('div', `${item.value} -- ${item.reason}`);
  });

  return h(PointsMenuContainer, [
    h(SignInMenuEl, [
      items.length === 0 ? h('div', 'Start getting points!') : HistoryItems,
    ]),
  ]);
};

const Points = styled.div`
  color: #fff;
  background-color: limegreen;
  border-radius: 5px;
  padding: 2px 5px;
  font-size: 12px;
`;

const PointsContainer = styled.div`
  margin-right: 0;
`;

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

    let Icon = h(Points, { onClick: this.toggleMenu }, `+${points}`);
    if (points === 0) {
      Icon = h('i.fa.fa-trophy.fa-lg', { onClick: this.toggleMenu });
    }

    return h(NavHover, { style: { position: 'relative' } }, [
      h(PointsContainer, [
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
