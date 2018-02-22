import { Component } from 'react';
import { connect } from 'react-redux';
import * as h from 'react-hyperscript';

import { utils, actionCreators, selectors } from '@youhood/hood';
const { getHoodsOnPoint, getHoodIdSelected, getVisibleHoodsOnPoint } = selectors;
const {
  getHoodProperties,
  getHoodId,
} = utils;
const { toggleHoodSelected, hoverHood, hideHoods, showHoods } = actionCreators;
import { Hoods, HoodId, HoodIds } from '@youhood/hood/types';

import { State } from '../types';
import { 
  HoodListItem, 
  HoodSelectionContainer, 
  OverlayHeader, 
  OverlayContainer, 
  HoodListItemSelected,
  HoodSelectionItem,
  HoodVisibility,
} from './ui';
import {  } from '@youhood/hood/selectors';

interface Hover {
  (hoodId: HoodId, hover: boolean): void;
}

interface Toggle {
  (hoodId: HoodId): void;
}

interface HoodVisible {
  (hoodIds: HoodIds): void;
}

interface Props {
  show: boolean;
  toggle: Toggle;
  hoods: Hoods;
  visibleHoodIds: HoodIds;
  hover: Hover;
  hoodIdSelected: HoodId;
  hideHoods: HoodVisible;
  showHoods: HoodVisible;
}

interface DefaultProps {
  show: boolean;
  visibleHoodIds: HoodIds;
  hoods: Hoods;
  hover: Hover;
  toggle: Toggle;
  hideHoods: HoodVisible;
  showHoods: HoodVisible;
}

const noop = () => {};

export class HoodSelection extends Component {
  props: Props;

  static defaultProps: DefaultProps = {
    show: false,
    hoods: [],
    visibleHoodIds: [],
    hover: noop,
    toggle: noop,
    hideHoods: noop,
    showHoods: noop,
  };

  render() {
    const { show, hoods, hover, toggle, hoodIdSelected, showHoods, hideHoods, visibleHoodIds } = this.props;
    if (!show) return null;
    const hoodIds = hoods.map((hood) => getHoodId(hood));
    const allHoodsAreVisible = hoods.length === visibleHoodIds.length;

    return h(OverlayContainer, [
      h(OverlayHeader, 'Hoods on Point'),
      h(HoodSelectionContainer, [
        h('div', [
          allHoodsAreVisible ? h(HoodVisibility, { className: 'fa fa-eye', onClick: () => hideHoods(hoodIds) }) : 
            h(HoodVisibility, { className: 'fa fa-eye-slash', onClick: () => showHoods(hoodIds) }),
        ]),
        ...hoods.map((hood) => {
          const { name } = getHoodProperties(hood);
          const hoodId = getHoodId(hood);
          const Item = hoodIdSelected === hoodId ? HoodListItemSelected : HoodListItem; 
          const isHoodVisible = visibleHoodIds.indexOf(hoodId) >= 0;

          return h(HoodSelectionItem, [
            isHoodVisible ? h(HoodVisibility, { className: 'fa fa-eye', onClick: () => hideHoods([hoodId]) }) :
              h(HoodVisibility, { className: 'fa fa-eye-slash', onClick: () => showHoods([hoodId]) }),
            h(Item, {
              key: hoodId,
              onClick: () => toggle(hoodId),
              onMouseEnter: () => hover(hoodId, true),
              onMouseLeave: () => hover(hoodId, false),
            }, `[${name}]`),
          ]);
        }),
      ]),
    ]);
  }
}

export default connect(
  (state: State) => ({
    hoods: getHoodsOnPoint(state),
    hoodIdSelected: getHoodIdSelected(state),
    visibleHoodIds: getVisibleHoodsOnPoint(state),
  }),
  (dispatch: Function) => ({
    toggle: (hoodId: HoodId) => dispatch(toggleHoodSelected(hoodId)),
    hover: (hoodId: HoodId, hover: boolean) => dispatch(hoverHood({ hoodId, hover })),
    hideHoods: (hoodIds: HoodIds) => dispatch(hideHoods(hoodIds)),
    showHoods: (hoodIds: HoodIds) => dispatch(showHoods(hoodIds)),
  }),
)(HoodSelection as any);
