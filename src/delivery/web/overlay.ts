/* @flow */
import { Component } from 'react';
import { connect } from 'react-redux';
import h from 'react-hyperscript';

import { selectors } from '../../packages/menu';
import Hood from './hood';
import HoodSelection from './hood-selection';

const { isOverlayOpen } = selectors;

export class Overlay extends Component {
  render() {
    return h('div.overlay-container', [
      h(Hood, this.props),
      h(HoodSelection, this.props),
    ]);
  }
}

export const OverlayConn = connect(
  (state) => ({
    show: isOverlayOpen(state),
  }),
)(Overlay);
