import { State, HoodId, UserId } from '../../types';

import { selectors } from '../../packages/hood';
const { getHoodIdsOnPoint } = selectors;

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
  getVotes(state)[hoodId] || [];
export const didUserVoteOnHood = (
  state: State, { hoodId, userId }: HoodAndUserInProp,
) => {
  const votes = getVotesByHood(state, { hoodId });
  return votes.indexOf(userId) >= 0;
};
export const getVoteCountByHood = (state: State, { hoodId }: HoodIdInProp) =>
  getVotesByHood(state, { hoodId }).length;
export const didUserVoteInHoodsOnPoint = (state: State, { userId }: UserIdInProp) => {
  const hoodIdsOnPoint = getHoodIdsOnPoint(state);
  return hoodIdsOnPoint.some((hoodId) => didUserVoteOnHood(state, { hoodId, userId }));
};
