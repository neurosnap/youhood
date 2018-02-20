import { creator } from '@youhood/shared';
import { UserId } from '@youhood/user/types';

import { Token, AuthError, AuthPayload } from './types';
import * as types from './action-types';

export const signIn = creator<AuthPayload>(types.SIGN_IN);
export const signedIn = creator<UserId>(types.SIGNED_IN);
export const signOut = () => ({ type: types.SIGN_OUT });
export const signedOut = () => ({ type: types.SIGNED_OUT });
export const register = creator<AuthPayload>(types.REGISTER);
export const setToken = creator<Token>(types.SET_TOKEN);
export const resetToken = () => ({ type: types.RESET_TOKEN });
export const authError = creator<AuthError>(types.AUTH_ERROR);
