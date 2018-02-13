import { Component } from 'react';
import { connect } from 'react-redux';
import * as h from 'react-hyperscript';

import { selectors } from '@youhood/menu';
import { State } from '../../types';

import HoodView from './hood';
import HoodSelection from './hood-selection';

const { isOverlayOpen } = selectors;

export class Overlay extends Component {
  render() {
    return h('div.overlay-container', [
      h(HoodView, this.props),
      h(HoodSelection, this.props),
    ]);
  }
}

export default connect(
  (state: State) => ({
    show: isOverlayOpen(state),
  }),
)(Overlay as any);
