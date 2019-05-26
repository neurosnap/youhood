import { Component } from 'react';
import { connect } from 'react-redux';
import * as h from 'react-hyperscript';

import { HoodProps, HoodId, EditHoodPayload } from '@youhood/hood/types';
import { actions, selectors, utils } from '@youhood/hood';
const { editHood } = actions;
const { createHood } = utils;
const { getHoodSelected } = selectors;
import { selectors as userSelectors } from '@youhood/user';
const { getUserById, getCurrentUserId } = userSelectors;
import {
  selectors as voteSelectors,
  actions as voteActions,
} from '@youhood/vote';
import { VoteTypes } from '@youhood/vote/types';
const {
  getVoteCountByHood,
  didUserVoteOnHood,
  getUserVoteTypeForHood,
} = voteSelectors;
const { upvote, downvote, unvote } = voteActions;
import { selectors as tokenSelectors } from '@youhood/token';
const { getIsUserLoggedIn } = tokenSelectors;
import { User, WebState } from '@youhood/types';

import {
  HoodContainer,
  HeaderSmall,
  Votes,
  VoteUp,
  Voted,
  Actions,
  OverlayHeader,
  OverlayContainer,
  Link,
  Header,
  TextSmall,
} from './ui';
import { formatDate } from './date';
import HoodReport from './hood-report';

type UserId = string;

const noop = () => {};

interface Props {
  canEdit?: boolean;
  canUserVote?: boolean;
  currentUserId?: UserId;
  edit?: Function;
  handleUnvote?: Function;
  handleUpvote?: Function;
  handleDownvote?: Function;
  hood: HoodProps;
  hoodId: HoodId;
  user?: User;
  userVoted?: boolean;
  votes?: number;
  userVoteType?: VoteTypes;
}

interface DefaultProps {
  canEdit: boolean;
  canUserVote: boolean;
  currentUserId: UserId;
  edit: Function;
  handleUnvote: Function;
  handleUpvote: Function;
  handleDownvote: Function;
  hood: HoodProps;
  user: User;
  userVoted: boolean;
  votes: number;
  userVoteType: VoteTypes;
}

export class HoodViewer extends Component<Props> {
  static defaultProps: DefaultProps = {
    canEdit: false,
    canUserVote: false,
    currentUserId: '',
    edit: noop,
    handleUnvote: noop,
    handleUpvote: noop,
    handleDownvote: noop,
    hood: createHood({ id: '123' }),
    userVoteType: null,
    user: {
      email: 'Unknown',
      id: '',
      createdAt: '',
      isTmp: true,
    },
    userVoted: false,
    votes: 0,
  };

  handleEdit = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const { edit, hoodId } = this.props;
    edit({ hoodId, edit: true });
  };

  render() {
    const {
      hoodId,
      hood,
      user,
      canEdit,
      votes,
      userVoted,
      userVoteType,
      canUserVote,
      handleUpvote,
      handleDownvote,
      handleUnvote,
      currentUserId,
    } = this.props;
    if (!hoodId) {
      return null;
    }

    const actions = [];
    if (canEdit) {
      actions.push(
        h(Link, { href: '/edit', onClick: this.handleEdit }, 'Edit'),
      );
    }

    const userUpvoted = userVoted && userVoteType === 'upvote';
    const userDownvoted = userVoted && userVoteType === 'downvote';
    const VoteUpState = userUpvoted ? Voted : VoteUp;
    const VoteDownState = userDownvoted ? Voted : VoteUp;
    const UserUpVoting = canUserVote
      ? h(
          VoteUpState,
          {
            onClick: () => {
              if (userUpvoted) {
                handleUnvote(hoodId, currentUserId, 'upvote');
                return;
              }

              handleUpvote(hoodId, currentUserId);
            },
          },
          '/\\',
        )
      : null;
    const UserDownVoting = canUserVote
      ? h(
          VoteDownState,
          {
            onClick: () => {
              if (userDownvoted) {
                handleUnvote(hoodId, currentUserId, 'downvote');
                return;
              }

              handleDownvote(hoodId, currentUserId);
            },
          },
          '\\/',
        )
      : null;

    const username = user.isTmp ? 'Anonymous' : user.email;
    return h(OverlayContainer, [
      h(OverlayHeader, [h(Header, 'Hood Viewer'), h(Actions, actions)]),
      h(HoodContainer, [
        h(Votes, [UserUpVoting, h(Header, votes), UserDownVoting]),
        h('div', { style: { width: '85%' } }, [
          h(HeaderSmall, hood.name),
          h(TextSmall, [h('div', 'User'), h('div', username)]),
          h(TextSmall, [
            h('div', 'Last Updated'),
            h('div', formatDate(hood.updatedAt)),
          ]),
          h(TextSmall, [
            h('div', 'Created'),
            h('div', formatDate(hood.createdAt)),
          ]),
          h(HoodReport, { hood }),
        ]),
      ]),
    ]);
  }
}

export default connect(
  (state: WebState) => {
    const hood = getHoodSelected(state);
    const hoodId = hood.id;
    const userId = hood.userId;
    const user = getUserById(state, { id: userId });
    const currentUserId = getCurrentUserId(state);
    const didUserCreateHood = user && user.id === currentUserId;
    const userIsAuthenticated = getIsUserLoggedIn(state);
    const canUserVote = !didUserCreateHood && userIsAuthenticated;

    return {
      hoodId,
      hood,
      user: user || {},
      canEdit: didUserCreateHood,
      votes: getVoteCountByHood(state, { hoodId }),
      userVoted: didUserVoteOnHood(state, { hoodId, userId: currentUserId }),
      userVoteType: getUserVoteTypeForHood(state, {
        hoodId,
        userId: currentUserId,
      }),
      canUserVote,
      currentUserId,
    };
  },
  (dispatch: Function) => ({
    edit: (opts: EditHoodPayload) => dispatch(editHood(opts)),
    handleUpvote: (hoodId: HoodId, userId: UserId) =>
      dispatch(upvote({ hoodId, userId })),
    handleDownvote: (hoodId: HoodId, userId: UserId) =>
      dispatch(downvote({ hoodId, userId })),
    handleUnvote: (hoodId: HoodId, userId: UserId, voteType: VoteTypes) =>
      dispatch(unvote({ hoodId, userId, voteType })),
  }),
)(HoodViewer as any);
