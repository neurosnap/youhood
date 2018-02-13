import { UserId } from '@youhood/user/types';

export type Token = string;
export type AuthError = string;

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
