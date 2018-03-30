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
import { selectors as voteSelectors } from '@youhood/vote';
const { getVoteCountByHoods } = voteSelectors;
import { VoteMap } from '@youhood/vote/types';

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
  votesByHood: VoteMap;
}

interface DefaultProps {
  show: boolean;
  visibleHoodIds: HoodIds;
  hoods: Hoods;
  hover: Hover;
  toggle: Toggle;
  hideHoods: HoodVisible;
  showHoods: HoodVisible;
  votesByHood: VoteMap;
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
    votesByHood: {},
  };

  render() {
    const {
      show,
      hoods,
      hover,
      toggle,
      hoodIdSelected,
      showHoods,
      hideHoods,
      visibleHoodIds,
      votesByHood,
    } = this.props;
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
          const votes = votesByHood[hoodId];

          return h(HoodSelectionItem, [
            isHoodVisible ? h(HoodVisibility, { className: 'fa fa-eye', onClick: () => hideHoods([hoodId]) }) :
              h(HoodVisibility, { className: 'fa fa-eye-slash', onClick: () => showHoods([hoodId]) }),
            h(Item, {
              key: hoodId,
              onClick: () => toggle(hoodId),
              onMouseEnter: () => hover(hoodId, true),
              onMouseLeave: () => hover(hoodId, false),
            }, `${votes} [${name}]`),
          ]);
        }),
      ]),
    ]);
  }
}

export default connect(
  (state: State) => {
    const hoods = getHoodsOnPoint(state);
    const hoodIds = hoods.map((hood) => getHoodId(hood));

    return {
      hoods,
      hoodIdSelected: getHoodIdSelected(state),
      visibleHoodIds: getVisibleHoodsOnPoint(state),
      votesByHood: getVoteCountByHoods(state, { hoodIds }),
    };
  },
  (dispatch: Function) => ({
    toggle: (hoodId: HoodId) => dispatch(toggleHoodSelected(hoodId)),
    hover: (hoodId: HoodId, hover: boolean) => dispatch(hoverHood({ hoodId, hover })),
    hideHoods: (hoodIds: HoodIds) => dispatch(hideHoods(hoodIds)),
    showHoods: (hoodIds: HoodIds) => dispatch(showHoods(hoodIds)),
  }),
)(HoodSelection as any);
