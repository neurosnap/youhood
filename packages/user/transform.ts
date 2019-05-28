import { User } from '@youhood/types';

import { RawUser } from './types';

export function transformUser(rawUser: RawUser): User {
  return {
    id: rawUser.id,
    email: rawUser.email,
    createdAt: rawUser.created_at,
    isTmp: rawUser.is_tmp,
  };
}
