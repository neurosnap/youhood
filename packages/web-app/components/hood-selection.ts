import { Component } from 'react';
import { connect } from 'react-redux';
import * as h from 'react-hyperscript';

import { utils, actionCreators, selectors } from '@youhood/hood';
import { Hoods, HoodId } from '@youhood/hood/types';

import { State } from '../types';
import { HoodSelectionContainer, HoodListItem } from './ui';

const { getHoodsOnPoint } = selectors;
const {
  getHoodProperties,
  getHoodId,
} = utils;
const { toggleHoodSelected, hoverHood } = actionCreators;

interface Props {
  show: boolean;
  toggle: Function;
  hoods: Hoods;
  hover: Hover;
}

interface Hover {
  (hoodId: HoodId, hover: boolean): void;
}

interface Toggle {
  (hoodId: HoodId): void;
}

interface DefaultProps {
  show: boolean;
  hoods: Hoods;
  hover: Hover;
  toggle: Toggle;
}

export class HoodSelection extends Component {
  props: Props;

  static defaultProps: DefaultProps = {
    show: false,
    hoods: [],
    hover: () => {},
    toggle: () => {},
  };

  render() {
    const { show, hoods, hover, toggle } = this.props;
    if (!show || hoods.length < 2) return null;

    return h(HoodSelectionContainer, hoods.map((hood) => {
      const { name } = getHoodProperties(hood);
      const hoodId = getHoodId(hood);
      return h(
        HoodListItem, {
          key: hoodId,
          onClick: () => toggle(hoodId),
          onMouseEnter: () => hover(hoodId, true),
          onMouseLeave: () => hover(hoodId, false),
        },
        `[${name}]`,
      );
    }));
  }
}

export default connect(
  (state: State) => ({
    hoods: getHoodsOnPoint(state),
  }),
  (dispatch: Function) => ({
    toggle: (hoodId: HoodId) => dispatch(toggleHoodSelected(hoodId)),
    hover: (hoodId: HoodId, hover: boolean) => dispatch(hoverHood({ hoodId, hover })),
  }),
)(HoodSelection as any);
