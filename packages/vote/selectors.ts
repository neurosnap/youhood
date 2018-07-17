import { UserId } from '@youhood/user/types';
import { HoodId, HoodIds } from '@youhood/hood/types';
import { selectors } from '@youhood/hood';
const { getHoodIdsOnPoint } = selectors;

import { VoteMap } from './types';

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
  getVotes(state)[hoodId] || [];
export const didUserVoteOnHood = (
  state: State,
  { hoodId, userId }: HoodAndUserInProp,
) => {
  const votes = getVotesByHood(state, { hoodId });
  return votes.indexOf(userId) >= 0;
};
export const getVoteCountByHood = (state: State, { hoodId }: HoodIdInProp) =>
  getVotesByHood(state, { hoodId }).length;
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
