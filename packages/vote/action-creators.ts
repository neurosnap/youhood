import { HoodId } from '@youhood/hood/types';
import { creator } from '@youhood/shared';

import * as types from './action-types';
import { Votes, VotePayload } from './types';

export const vote = creator<VotePayload>(types.VOTE);
export const unvote = creator<VotePayload>(types.UNVOTE);
export const fetchVotesByHood = creator<HoodId>(types.FETCH_VOTES_BY_HOOD);
export const addVotes = creator<Votes>(types.ADD_VOTES);
export const removeVotes = creator<Votes>(types.REMOVE_VOTES);
