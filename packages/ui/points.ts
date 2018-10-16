import * as h from 'react-hyperscript';
import { connect } from 'react-redux';
import { Component } from 'react';
import styled from 'styled-components';

import { selectors } from '@youhood/point';
const { getTotalPoints, getPoints } = selectors;
import { Points as PointsType } from '@youhood/point/types';

import { WebState } from '@youhood/types';
import { NavHover, DropMenuEl, Points } from './ui';

const PointsMenuContainer = styled.div`
  overflow-y: scroll;
  position: absolute;
  background: #4285f4;
  top: 46px;
  right: -2px;
  z-index: 401;
  width: 300px;
  height: 230px;
`;

interface PointItem {
  value: number;
  reason: string;
}

interface IProps {
  open: boolean;
  items: PointItem[];
}

export const DropMenu: React.SFC<IProps> = ({ open, items }) => {
  if (!open) {
    return null;
  }

  const HistoryItems = items.map((item, i) => {
    return h('div', { key: i }, `${item.value} -- ${item.reason}`);
  });

  const points =
    items.length === 0 ? [h('div', 'Start getting points!')] : HistoryItems;

  return h(PointsMenuContainer, [h(DropMenuEl, points)]);
};

DropMenu.defaultProps = {
  open: false,
  items: [],
};

const PointsContainer = styled.div`
  margin-right: 0;
`;

interface Props {
  points: number;
  pointHistory: PointsType;
}

export class PointsView extends Component {
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
  };

  render() {
    const { points, pointHistory } = this.props;
    const { open } = this.state;

    let Icon = h(Points, { onClick: this.toggleMenu }, `+${points}`);
    if (points === 0) {
      Icon = h('i.fa.fa-trophy.fa-lg', { onClick: this.toggleMenu });
    }

    return h(NavHover, { style: { position: 'relative' } }, [
      h(PointsContainer, [Icon]),
      h(DropMenu, { open, items: pointHistory }),
    ]);
  }
}

export default connect((state: WebState) => ({
  points: getTotalPoints(state),
  pointHistory: getPoints(state),
}))(PointsView as any);
