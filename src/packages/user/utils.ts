import * as createUuid from 'uuid/v4';

import { User } from '../../types';

const defaultUser = { id: '', name: 'Anonymous' };
export const createUser = (props: { [key: string]: any } = defaultUser): User => ({
  id: props.id || createUuid(),
  email: props.email || 'Anonymous',
});
