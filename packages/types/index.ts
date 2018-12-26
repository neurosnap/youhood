import { UserId, UserHash } from '@youhood/user/types';
import { HoodId, HoodIds, HoodHash } from '@youhood/hood/types';
import { Menus } from '@youhood/menu/types';
import { Points } from '@youhood/point/types';
import { Votes } from '@youhood/vote/types';
import { AuthError } from '@youhood/auth/types';

export interface Action<P = any> {
  type: string;
  payload: P;
}

export type Token = string;

export interface OnboardState {
  showOnboard: boolean;
  completed: number;
}

export interface ApiKey {
  id: string;
  apiKey: string;
  label: string;
  isValid: boolean;
  createdAt: string;
}
export type ApiKeysState = ApiKey[];

export interface WebState {
  selected: HoodId;
  hoods: HoodHash;
  menus: Menus;
  hoodsOnPoint: HoodIds;
  hoodWinners: HoodIds;
  points: Points;
  currentUser: UserId;
  users: UserHash;
  token: Token;
  authError: AuthError;
  votes: Votes;
  onboard: OnboardState;
  apiKeys: ApiKeysState;
}
