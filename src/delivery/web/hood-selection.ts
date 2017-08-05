import { Component } from 'react';
import { connect } from 'react-redux';
import h from 'react-hyperscript';

import { Polygon, Polygons, State } from '../../types';
import { utils, actionCreators, selectors } from '../../packages/hood';

const { getHoodsOnPoint } = selectors;
const {
  hoverHood,
  getHoodProperties,
  getHoodUser,
} = utils;
const { toggleHoodSelected } = actionCreators;

export class HoodSelection extends Component {
  static defaultProps = {
    show: false,
    polygons: [],
  };

  props: {
    show: boolean,
    handleToggleHoodSelected: Function,
    polygons: Polygons,
  };

  handleClick = (polygon: Polygon) => {
    this.props.handleToggleHoodSelected(polygon);
  }

  handleHover = (polygon: Polygon, hover: boolean) => {
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
    handleToggleHoodSelected: (hood: Polygon) => dispatch(toggleHoodSelected(hood)),
  }),
)(HoodSelection);
