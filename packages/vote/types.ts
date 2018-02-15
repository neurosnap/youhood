import { UserId } from '@youhood/user/types';

export type VoteList = UserId[];
export interface Votes {
  [key: string]: UserId[];
}
