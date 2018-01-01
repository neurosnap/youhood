import { UserId, HoodId, HoodIds, Votes } from '../../types';
import { creator } from '../shared';

import * as types from './action-types';

export interface VotePayload {
  userId: UserId;
  hoodId: HoodId;
}

export interface VoteAction {
  type: string;
  payload: VotePayload;
}

export interface FetchVotesByHoodAction {
  type: string;
  payload: HoodIds;
}

export interface AddVotesAction {
  type: string;
  payload: Votes;
}

export const vote = creator<VotePayload>(types.VOTE);
export const unvote = creator<VotePayload>(types.UNVOTE);
export const fetchVotesByHood = creator<HoodId>(types.FETCH_VOTES_BY_HOOD);
export const addVotes = creator<Votes>(types.ADD_VOTES);
export const removeVotes = creator<Votes>(types.REMOVE_VOTES);
