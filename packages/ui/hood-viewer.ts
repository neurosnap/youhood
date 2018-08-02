import { Component } from 'react';
import { connect } from 'react-redux';
import * as h from 'react-hyperscript';

import { HoodProps, HoodId, EditHoodPayload } from '@youhood/hood/types';
import { User, UserId } from '@youhood/user/types';
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
const { getVoteCountByHood, didUserVoteOnHood } = voteSelectors;
const { vote, unvote } = voteActions;
import { selectors as authSelectors } from '@youhood/auth';
const { isUserAuthenticated } = authSelectors;
import { State } from '@youhood/web-app/types';

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

const noop = () => {};

interface Props {
  canEdit?: boolean;
  canUserVote?: boolean;
  currentUserId?: UserId;
  edit?: Function;
  handleUnvote?: Function;
  handleVote?: Function;
  hood: HoodProps;
  hoodId: HoodId;
  user?: User;
  userVoted?: boolean;
  votes?: number;
}

interface DefaultProps {
  canEdit: boolean;
  canUserVote: boolean;
  currentUserId: UserId;
  edit: Function;
  handleUnvote: Function;
  handleVote: Function;
  hood: HoodProps;
  user: User;
  userVoted: boolean;
  votes: number;
}

export class HoodViewer extends Component<Props> {
  static defaultProps: DefaultProps = {
    canEdit: false,
    canUserVote: false,
    currentUserId: '',
    edit: noop,
    handleUnvote: noop,
    handleVote: noop,
    hood: createHood({ id: '123' }),
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
      canUserVote,
      handleVote,
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

    const VoteState = userVoted ? Voted : VoteUp;
    const UserVoting = canUserVote
      ? h(VoteState, {
          className: 'fa fa-angle-up',
          onClick: () => {
            if (userVoted) {
              handleUnvote(hoodId, currentUserId);
              return;
            }

            handleVote(hoodId, currentUserId);
          },
        })
      : null;

    const username = user.isTmp ? 'Anonymous' : user.email;
    return h(OverlayContainer, [
      h(OverlayHeader, [h(Header, 'Hood Viewer'), h(Actions, actions)]),
      h(HoodContainer, [
        h(Votes, [UserVoting, h(Header, votes)]),
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
        ]),
      ]),
    ]);
  }
}

export default connect(
  (state: State) => {
    const hood = getHoodSelected(state);
    const hoodId = hood.id;
    const userId = hood.userId;
    const user = getUserById(state, { id: userId });
    const currentUserId = getCurrentUserId(state);
    const didUserCreateHood = user && user.id === currentUserId;
    const userIsAuthenticated = isUserAuthenticated(state);
    const canUserVote = !didUserCreateHood && userIsAuthenticated;

    return {
      hoodId,
      hood,
      user: user || {},
      canEdit: didUserCreateHood,
      votes: getVoteCountByHood(state, { hoodId }),
      userVoted: didUserVoteOnHood(state, { hoodId, userId }),
      canUserVote,
      currentUserId,
    };
  },
  (dispatch: Function) => ({
    edit: (opts: EditHoodPayload) => dispatch(editHood(opts)),
    handleVote: (hoodId: HoodId, userId: UserId) =>
      dispatch(vote({ hoodId, userId })),
    handleUnvote: (hoodId: HoodId, userId: UserId) =>
      dispatch(unvote({ hoodId, userId })),
  }),
)(HoodViewer as any);
