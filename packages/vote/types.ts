import { UserId } from '@youhood/user/types';
import { HoodId, HoodIds } from '@youhood/hood/types';

export type VoteTypes = 'upvote' | 'downvote';
export interface NeighborhoodVotes {
  [key: string]: VoteTypes;
}

export type VoteList = UserId[];
export interface Votes {
  [key: string]: NeighborhoodVotes;
}

export interface VotePayload {
  userId: UserId;
  hoodId: HoodId;
}

export type UnvotePayload = VotePayload & { voteType: VoteTypes };
export interface UnvoteAction {
  type: string;
  payload: UnvotePayload;
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

export interface VoteMap {
  [key: string]: number;
}
