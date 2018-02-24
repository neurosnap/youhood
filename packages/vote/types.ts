import { UserId } from '@youhood/user/types';
import { HoodId, HoodIds } from '@youhood/hood/types';

export type VoteList = UserId[];
export interface Votes {
  [key: string]: UserId[];
}

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

export interface VoteMap {
  [key: string]: number;
}
