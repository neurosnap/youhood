import * as React from 'react';
import { connect } from 'react-redux';

import { HoodProps, HoodId, EditHoodPayload } from '@youhood/hood/types';
import { actions, selectors } from '@youhood/hood';
const { editHood } = actions;
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

interface Props {
  canEdit: boolean;
  canUserVote: boolean;
  currentUserId: UserId;
  edit: (p: { hoodId: HoodId; edit: boolean }) => void;
  handleUnvote: (
    hoodId: HoodId,
    currentUserId: string,
    vote: VoteTypes,
  ) => void;
  handleUpvote: (hoodId: HoodId, currentUserId: string) => void;
  handleDownvote: (hoodId: HoodId, currentUserId: string) => void;
  hood: HoodProps;
  hoodId: HoodId;
  user: User;
  userVoted: boolean;
  votes: number;
  userVoteType: VoteTypes;
}

export class HoodViewer extends React.Component<Props> {
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
        <Link href="/edit" onClick={this.handleEdit}>
          Edit
        </Link>,
      );
    }

    const userUpvoted = userVoted && userVoteType === 'upvote';
    const userDownvoted = userVoted && userVoteType === 'downvote';
    const VoteUpState = userUpvoted ? Voted : VoteUp;
    const VoteDownState = userDownvoted ? Voted : VoteUp;
    const UserUpVoting = canUserVote ? (
      <VoteUpState
        onClick={() => {
          if (userUpvoted) {
            handleUnvote(hoodId, currentUserId, 'upvote');
            return;
          }

          handleUpvote(hoodId, currentUserId);
        }}
      >
        /\\
      </VoteUpState>
    ) : null;
    const UserDownVoting = canUserVote ? (
      <VoteDownState
        onClick={() => {
          if (userDownvoted) {
            handleUnvote(hoodId, currentUserId, 'downvote');
            return;
          }

          handleDownvote(hoodId, currentUserId);
        }}
      >
        \\/
      </VoteDownState>
    ) : null;

    const username = user.isTmp ? 'Anonymous' : user.email;
    return (
      <OverlayContainer>
        <OverlayHeader>
          <Header>Hood Viewer</Header>
          <Actions>{...actions}</Actions>
        </OverlayHeader>
        <HoodContainer>
          <Votes>
            {UserUpVoting}
            <Header>{votes}</Header>
            {UserDownVoting}
          </Votes>
          <div style={{ width: '85%' }}>
            <HeaderSmall>{hood.name}</HeaderSmall>
            <TextSmall>
              <div>User</div>
              <div>{username}</div>
            </TextSmall>
            <TextSmall>
              <div>Last Updated</div>
              <div>{formatDate(hood.updatedAt)}</div>
            </TextSmall>
            <TextSmall>
              <div>Created</div>
              <div>{formatDate(hood.createdAt)}</div>
            </TextSmall>
            <HoodReport hood={hood} />
          </div>
        </HoodContainer>
      </OverlayContainer>
    );
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
)(HoodViewer);
