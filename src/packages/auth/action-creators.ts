import { UserId, Token, AuthError } from '../../types';

import { creator } from '../shared';

import * as types from './action-types';

export interface TokenAction {
  type: string;
  payload: Token;
}

export interface AuthAction {
  type: string;
  payload: AuthPayload;
}

export interface AuthPayload {
  email: string;
  password: string;
  currentUserId: UserId;
}

export interface AuthErrorAction {
  type: string;
  payload: AuthError;
}

export const signIn = creator<AuthPayload>(types.SIGN_IN);
export const register = creator<AuthPayload>(types.REGISTER);
export const setToken = creator<Token>(types.SET_TOKEN);
export const resetToken = () => ({ type: types.RESET_TOKEN });
export const authError = creator<AuthError>(types.AUTH_ERROR);
export const signOut = () => ({ type: types.SIGN_OUT });
