import { creator } from '@youhood/shared';
import { UserId } from '@youhood/user/types';

import { Token, AuthError, AuthPayload } from './types';

export const signIn = creator<AuthPayload>('SIGN_IN');
export const signedIn = creator<UserId>('SIGNED_IN');
export const signOut = creator('SIGN_OUT');
export const signedOut = creator('SIGNED_OUT');
export const register = creator<AuthPayload>('REGISTER');
export const setToken = creator<Token>('SET_TOKEN');
export const resetToken = creator('RESET_TOKEN');
export const authError = creator<AuthError>('AUTH_ERROR');
