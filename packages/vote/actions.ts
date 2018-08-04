import { HoodId } from '@youhood/hood/types';
import { creator } from '@youhood/shared';

import { Votes, VotePayload, UnvotePayload } from './types';

export const upvote = creator<VotePayload>('UPVOTE');
export const unvote = creator<UnvotePayload>('UNVOTE');
export const downvote = creator<VotePayload>('DOWNVOTE');
export const fetchVotesByHood = creator<HoodId>('FETCH_VOTES_BY_HOOD');
export const addVotes = creator<Votes>('ADD_VOTES');
