/* @flow */
import { Component } from 'react';
import ReactDOM from 'react-dom';
import h from 'react-hyperscript';

import type { State, Polygon } from './types';
import {
  toggleSelectHood,
  deselectHood,
  hoverHood,
  setHoodName,
  getHoodName,
  getHoodProperties,
  getHoodId,
  getHoodUser,
} from './polygon';

export class Overlay extends Component {
  render() {
    return h('div.overlay-container', [
      h(Hood, this.props),
      h(HoodSelection, this.props),
    ]);
  }
}

class HoodSelection extends Component {
  static defaultProps = {
    hoods: [],
    show: false,
    state: {},
  };

  props: {
    show: boolean,
    state: State,
  };

  handleClick = (polygon: Polygon) => {
    toggleSelectHood(polygon, this.props.state);
  };

  handleHover = (polygon: Polygon, hover) => {
    hoverHood(polygon, hover);
  };

  render() {
    const { state, show } = this.props;
    const { polygons } = state;
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

class Hood extends Component {
  static defaultProps = {
    show: false,
    state: {},
    hood: null,
  };

  state = {
    name: '',
  };

  componentWillMount() {
    this.setState({ name: getHoodName(this.props.hood) });
  }

  componentWillReceiveProps(nextProps) {
    if (getHoodId(nextProps.hood) !== getHoodId(this.props.hood)) {
      this.setState({ name: getHoodName(nextProps.hood) });
    }
  }

  props: {
    hood: Polygon,
    show: boolean,
    state: State,
  };

  handleSave = () => {
    const { name } = this.state;
    const { state } = this.props;
    if (!state.selected) return;
    setHoodName(state.selected, name);
  };

  handleClose = () => {
    const { state } = this.props;
    deselectHood(state.selected, state);
    hideHoodOverlay();
  };

  handleInput = (event) => {
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

export function showHoodOverlay(polygon: Polygon, state: State) {
  renderOverlay({ hood: polygon, show: true, state });
}

export function hideHoodOverlay() {
  renderOverlay({ show: false });
}

export function renderOverlay(props: Object) {
  ReactDOM.render(
    h(Overlay, props),
    document.querySelector('.overlay-cont'),
  );
}
