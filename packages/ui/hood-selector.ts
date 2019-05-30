import { Component } from 'react';
import { connect } from 'react-redux';
import * as h from 'react-hyperscript';

import { actions, selectors } from '@youhood/hood';
const {
  getHoodsOnPoint,
  getHoodIdSelected,
  getVisibleHoodsOnPoint,
} = selectors;
const { toggleHoodSelected, hoverHood, hideHoods, showHoods } = actions;
import { HoodId, HoodIds, HoodPropsList } from '@youhood/hood/types';
import { selectors as voteSelectors } from '@youhood/vote';
const { getVoteCountByHoods } = voteSelectors;
import { VoteMap } from '@youhood/vote/types';

import { WebState } from '@youhood/types';
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
  hoods: HoodPropsList;
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
  hoods: HoodPropsList;
  hover: Hover;
  toggle: Toggle;
  hideHoods: HoodVisible;
  showHoods: HoodVisible;
  votesByHood: VoteMap;
}

const noop = () => {};

export class HoodSelector extends Component<Props> {
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
    if (!show || hoods.length <= 1) {
      return null;
    }
    const hoodIds = hoods.map((hood) => hood.id);
    const allHoodsAreVisible = hoods.length === visibleHoodIds.length;

    return h(OverlayContainer, [
      h(OverlayHeader, 'Hoods on Point'),
      h(HoodSelectionContainer, [
        h('div', { style: { margin: '0.2rem 0' } }, [
          allHoodsAreVisible
            ? h(
                HoodVisibility,
                {
                  onClick: () => hideHoods(hoodIds),
                },
                'hide all',
              )
            : h(
                HoodVisibility,
                {
                  onClick: () => showHoods(hoodIds),
                },
                'show all',
              ),
        ]),
        ...hoods.map((hood) => {
          const { name } = hood;
          const hoodId = hood.id;
          const Item =
            hoodIdSelected === hoodId ? HoodListItemSelected : HoodListItem;
          const isHoodVisible = visibleHoodIds.indexOf(hoodId) >= 0;
          const votes = votesByHood[hoodId];

          return h(HoodSelectionItem, [
            isHoodVisible
              ? h(
                  HoodVisibility,
                  {
                    onClick: () => hideHoods([hoodId]),
                  },
                  'hide',
                )
              : h(
                  HoodVisibility,
                  {
                    onClick: () => showHoods([hoodId]),
                  },
                  'show',
                ),
            h(
              Item,
              {
                key: hoodId,
                onClick: () => toggle(hoodId),
                onMouseEnter: () => hover(hoodId, true),
                onMouseLeave: () => hover(hoodId, false),
              },
              `${votes} [${name}]`,
            ),
          ]);
        }),
      ]),
    ]);
  }
}

export default connect(
  (state: WebState) => {
    const hoods = getHoodsOnPoint(state);
    const hoodIds = hoods.map((hood) => hood.id);

    return {
      hoods,
      hoodIdSelected: getHoodIdSelected(state),
      visibleHoodIds: getVisibleHoodsOnPoint(state),
      votesByHood: getVoteCountByHoods(state, { hoodIds }),
    };
  },
  (dispatch: Function) => ({
    toggle: (hoodId: HoodId) => dispatch(toggleHoodSelected(hoodId)),
    hover: (hoodId: HoodId, hover: boolean) =>
      dispatch(hoverHood({ hoodId, hover })),
    hideHoods: (hoodIds: HoodIds) => dispatch(hideHoods(hoodIds)),
    showHoods: (hoodIds: HoodIds) => dispatch(showHoods(hoodIds)),
  }),
)(HoodSelector as any);
