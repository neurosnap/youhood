import { Component } from 'react';
import { connect } from 'react-redux';
import h from 'react-hyperscript';

import { Hoods, Hood, State } from '../../types';
import { utils, actionCreators, selectors } from '../../packages/hood';

const { getHoodsOnPoint } = selectors;
const {
  hoverHood,
  getHoodProperties,
  getHoodUser,
} = utils;
const { toggleHoodSelected } = actionCreators;

interface Props {
  show: boolean;
  handleToggleHoodSelected: Function;
  polygons: Hoods;
}

interface DefaultProps {
  show: boolean;
  polygons: Hoods;
}

export class HoodSelection extends Component {
  props: Props;

  static defaultProps: DefaultProps = {
    show: false,
    polygons: [],
  };

  handleClick = (polygon: Hood) => {
    this.props.handleToggleHoodSelected(polygon);
  }

  handleHover = (polygon: Hood, hover: boolean) => {
    hoverHood(polygon, hover);
  }

  render() {
    const { show, polygons } = this.props;
    if (!show || polygons.length < 2) return null;

    return h('div.overlay.hood-selection', polygons.map((polygon) => {
      const { id, name } = getHoodProperties(polygon);
      const user = getHoodUser(polygon);
      return h(
        'div.hood-list-item', {
          key: id,
          onClick: () => this.handleClick(polygon),
          onMouseEnter: () => this.handleHover(polygon, true),
          onMouseLeave: () => this.handleHover(polygon, false),
        },
        `[${name}] - ${user.name}`,
      );
    }));
  }
}

export default connect(
  (state: State) => ({
    polygons: getHoodsOnPoint(state),
  }),
  (dispatch: Function) => ({
    handleToggleHoodSelected: (hood: Hood) => dispatch(toggleHoodSelected(hood)),
  }),
)(HoodSelection as any);
