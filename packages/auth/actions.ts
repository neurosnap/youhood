import { creator } from '@youhood/shared';
import { UserId } from '@youhood/user/types';

import { AuthError, AuthPayload } from './types';

export const signIn = creator<AuthPayload>('SIGN_IN');
export const signedIn = creator<UserId>('SIGNED_IN');
export const signOut = creator('SIGN_OUT');
export const signedOut = creator('SIGNED_OUT');
export const register = creator<AuthPayload>('REGISTER');
export const authError = creator<AuthError>('AUTH_ERROR');
