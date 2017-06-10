/* @flow */
import { Component } from 'react';
import ReactDOM from 'react-dom';
import h from 'react-hyperscript';

import type { State, Polygon } from './types';
import {
  toggleSelectHood,
  hoverHood,
  getHoodProperties,
  setHoodName,
  getHoodName,
  getHoodId,
  deselectHood,
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
      return h('div.hood-list-item', {
        key: id,
        onClick: () => this.handleClick(polygon),
        onMouseEnter: () => this.handleHover(polygon, true),
        onMouseLeave: () => this.handleHover(polygon, false),
      }, `[${name}] - ${id}`);
    }));
  }
}

class Hood extends Component {
  static defaultProps = {
    id: '',
    defaultName: '',
    show: false,
    state: {},
  };

  state = {
    name: '',
  };

  componentWillMount() {
    this.setState({ name: this.props.defaultName });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      this.setState({ name: nextProps.defaultName });
    }
  }

  props: {
    id: string,
    defaultName: string,
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
    const { show } = this.props;
    if (!show) return null;
    const { name } = this.state;

    return h('div.overlay.hood', [
      h('div', [
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
  const name = getHoodName(polygon);
  const id = getHoodId(polygon);
  renderOverlay({ id, defaultName: name, show: true, state });
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
