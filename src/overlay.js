/* @flow */
import { Component } from 'react';
import { connect } from 'react-redux';
import h from 'react-hyperscript';

import type { Polygon, Polygons, InputEvent } from './types';
import {
  hoverHood,
  getHoodName,
  getHoodProperties,
  getHoodId,
  getHoodUser,
} from './hood';
import {
  deselectHood,
  toggleHoodSelected,
  setHoodName,
  hideMenu,
} from './action-creators';

export class Overlay extends Component {
  render() {
    return h('div.overlay-container', [
      h(HoodConn, this.props),
      h(HoodSelectionConn, this.props),
    ]);
  }
}

export const OverlayConn = connect(
  (state) => ({
    show: state.menus.overlay,
  }),
)(Overlay);

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
  };

  handleHover = (polygon: Polygon, hover: boolean) => {
    hoverHood(polygon, hover);
  };

  render() {
    const { show, polygons } = this.props;
    if (!show || polygons.length < 2) return null;

    return h('div.overlay.hood-selection', polygons.map((polygon) => {
      const { id, name } = getHoodProperties(polygon);
      const user = getHoodUser(polygon);
      return h('div.hood-list-item', {
        key: id,
        onClick: () => this.handleClick(polygon),
        onMouseEnter: () => this.handleHover(polygon, true),
        onMouseLeave: () => this.handleHover(polygon, false),
      }, `[${name}] - ${user.name}`);
    }));
  }
}

const HoodSelectionConn = connect(
  (state) => ({
    polygons: state.hoodsOnPoint,
  }),
  (dispatch) => ({
    handleToggleHoodSelected: (hood) => dispatch(toggleHoodSelected(hood)),
  }),
)(HoodSelection);

type HoodProps = {
  hood: Polygon,
  show: boolean,
  updateHoodName: Function,
  handleDeselectHood: Function,
  hideHoodOverlay: Function,
};

export class Hood extends Component {
  static defaultProps = {
    show: false,
    hood: null,
  };

  state = {
    name: '',
  };

  componentWillMount() {
    this.setState({ name: getHoodName(this.props.hood) });
  }

  componentWillReceiveProps(nextProps: HoodProps) {
    if (getHoodId(nextProps.hood) !== getHoodId(this.props.hood)) {
      this.setState({ name: getHoodName(nextProps.hood) });
    }
  }

  props: HoodProps;

  handleSave = () => {
    const { hood, updateHoodName } = this.props;
    const { name } = this.state;
    updateHoodName({ hoodId: getHoodId(hood), name });
  };

  handleClose = () => {
    const { handleDeselectHood, hideHoodOverlay, hood } = this.props;
    handleDeselectHood(hood);
    hideHoodOverlay();
  };

  handleInput = (event: InputEvent) => {
    const name = event.target.value;
    this.setState({ name });
  };

  render() {
    const { hood, show } = this.props;
    if (!show) return null;
    const { name } = this.state;
    const user = getHoodUser(hood);

    return h('div.overlay.hood', [
      h('div', [
        h('div', [
          h('span', 'User: '),
          h('span', user.name),
        ]),
        h('label', { htmlFor: 'hood-name' }, 'Hood'),
        h('input', {
          type: 'input',
          value: name,
          onChange: this.handleInput,
        }),
      ]),
      h('div.actions', [
        h('button', { onClick: this.handleSave }, 'Save'),
        h('button', { onClick: this.handleClose }, 'Close'),
      ]),
    ]);
  }
}

const HoodConn = connect(
  (state) => ({
    hood: state.selected,
  }),
  (dispatch) => ({
    updateHoodName: (payload) => dispatch(setHoodName(payload)),
    handleDeselectHood: (hood) => dispatch(deselectHood(hood)),
    hideHoodOverlay: () => dispatch(hideMenu('overlay')),
  }),
)(Hood);
