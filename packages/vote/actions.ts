import { HoodId } from '@youhood/hood/types';
import { creator } from '@youhood/shared';

import { Votes, VotePayload } from './types';

export const vote = creator<VotePayload>('VOTE');
export const unvote = creator<VotePayload>('UNVOTE');
export const fetchVotesByHood = creator<HoodId>('FETCH_VOTES_BY_HOOD');
export const addVotes = creator<Votes>('ADD_VOTES');
export const removeVotes = creator<Votes>('REMOVE_VOTES');
