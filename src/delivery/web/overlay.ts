import { Component } from 'react';
import { connect } from 'react-redux';
import * as h from 'react-hyperscript';

import { selectors } from '../../packages/menu';
import { State } from '../../types';

import HoodCreate from './hood-create';
import HoodSelection from './hood-selection';

const { isOverlayOpen } = selectors;

export class Overlay extends Component {
  render() {
    return h('div.overlay-container', [
      h(HoodCreate, this.props),
      h(HoodSelection, this.props),
    ]);
  }
}

export default connect(
  (state: State) => ({
    show: isOverlayOpen(state),
  }),
)(Overlay as any);
