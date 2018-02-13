import { creator } from '@youhood/shared';
import { Token, AuthError, AuthPayload } from './types';

import * as types from './action-types';

export const signIn = creator<AuthPayload>(types.SIGN_IN);
export const register = creator<AuthPayload>(types.REGISTER);
export const setToken = creator<Token>(types.SET_TOKEN);
export const resetToken = () => ({ type: types.RESET_TOKEN });
export const authError = creator<AuthError>(types.AUTH_ERROR);
export const signOut = () => ({ type: types.SIGN_OUT });
