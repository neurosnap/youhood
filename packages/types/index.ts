import { UserId, UserHash } from '@youhood/user/types';
import { HoodId, HoodIds, HoodHash } from '@youhood/hood/types';
import { Menus } from '@youhood/menu/types';
import { Points } from '@youhood/point/types';
import { Votes } from '@youhood/vote/types';
import { Token, AuthError } from '@youhood/auth/types';

export interface OnboardState {
  showOnboard: boolean;
  completed: string;
}

export interface WebState {
  selected: HoodId;
  hoods: HoodHash;
  menus: Menus;
  hoodsOnPoint: HoodIds;
  points: Points;
  currentUser: UserId;
  users: UserHash;
  token: Token;
  authError: AuthError;
  votes: Votes;
  onboard: OnboardState;
}
