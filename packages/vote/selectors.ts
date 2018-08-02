import { UserId } from '@youhood/user/types';
import { HoodId, HoodIds } from '@youhood/hood/types';
import { selectors } from '@youhood/hood';
const { getHoodIdsOnPoint } = selectors;

import { VoteMap, NeighborhoodVotes, VoteTypes } from './types';

type State = any;
export const votes = 'votes';

interface HoodIdInProp {
  hoodId: HoodId;
}

interface UserIdInProp {
  userId: UserId;
}

type HoodAndUserInProp = HoodIdInProp & UserIdInProp;

export const getVotes = (state: State) => state[votes];
export const getVotesByHood = (state: State, { hoodId }: HoodIdInProp) =>
  getVotes(state)[hoodId] || {};
export const didUserVoteOnHood = (
  state: State,
  { hoodId, userId }: HoodAndUserInProp,
) => {
  const votes = getVotesByHood(state, { hoodId });
  return votes.hasOwnProperty(userId);
};
export const getUserVoteTypeForHood = (
  state: State,
  { hoodId, userId }: HoodAndUserInProp,
): VoteTypes => {
  const votes = getVotesByHood(state, { hoodId });

  if (!votes.hasOwnProperty(userId)) {
    return;
  }

  return votes[userId];
};
const getUpvotes = (votes: NeighborhoodVotes) =>
  Object.keys(votes).filter((userId) => votes[userId] === 'upvote');
const getDownvotes = (votes: NeighborhoodVotes) =>
  Object.keys(votes).filter((userId) => votes[userId] === 'downvote');
export const getVoteCountByHood = (state: State, { hoodId }: HoodIdInProp) => {
  const votes: NeighborhoodVotes = getVotesByHood(state, { hoodId });
  return getUpvotes(votes).length - getDownvotes(votes).length;
};
export const getVoteCountByHoods = (
  state: State,
  { hoodIds = [] }: { hoodIds: HoodIds },
): VoteMap =>
  hoodIds.reduce(
    (acc: VoteMap, hoodId: HoodId) => ({
      ...acc,
      [hoodId]: getVoteCountByHood(state, { hoodId }),
    }),
    {},
  );
export const didUserVoteInHoodsOnPoint = (
  state: State,
  { userId }: UserIdInProp,
) => {
  const hoodIdsOnPoint = getHoodIdsOnPoint(state);
  return hoodIdsOnPoint.some((hoodId) =>
    didUserVoteOnHood(state, { hoodId, userId }),
  );
};
