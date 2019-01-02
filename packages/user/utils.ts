import * as createUuid from 'uuid/v4';

import { User } from '@youhood/types';

export const defaultUser = {
  id: '',
  email: '',
  createdAt: '',
  isTmp: true,
};
export const createUser = (
  props: { [key: string]: any } = defaultUser,
): User => ({
  id: props.id || createUuid(),
  email: props.email || 'Anonymous',
});
