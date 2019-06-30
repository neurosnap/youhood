import * as React from 'react';
import { connect } from 'react-redux';
import { Component } from 'react';
import styled from 'styled-components';

import { selectors } from '@youhood/point';
const { getTotalPoints, getPoints } = selectors;
import { Points as PointsType } from '@youhood/point/types';
import theme from '@youhood/theme';
import { WebState } from '@youhood/types';

import { NavHover, DropMenuEl, Points, Trophy } from './ui';

const PointsMenuContainer = styled.div`
  overflow-y: scroll;
  position: absolute;
  background: ${theme.palette.bg.primary};
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

export const DropMenu: React.SFC<IProps> = ({ open = false, items = [] }) => {
  if (!open) {
    return null;
  }

  const HistoryItems = items.map((item, i) => {
    return <div key={i}>{`${item.value} -- ${item.reason}`}</div>;
  });

  const points =
    items.length === 0
      ? [<div key={0}>Start getting points!</div>]
      : HistoryItems;

  return (
    <PointsMenuContainer>
      <DropMenuEl>{...points}</DropMenuEl>
    </PointsMenuContainer>
  );
};

interface Props {
  points: number;
  pointHistory: PointsType;
}

interface State {
  open: boolean;
}

export class PointsView extends Component<Props, State> {
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

    let Icon = <Points onClick={this.toggleMenu}>+{points}</Points>;
    if (points === 0) {
      Icon = <Trophy onClick={this.toggleMenu} />;
    }

    return (
      <NavHover style={{ position: 'relative' }}>
        {Icon}
        <DropMenu open={open} items={pointHistory} />
      </NavHover>
    );
  }
}

export default connect((state: WebState) => ({
  points: getTotalPoints(state),
  pointHistory: getPoints(state),
}))(PointsView as any);
