export type AuthError = string;

export interface AuthAction {
  type: string;
  payload: AuthPayload;
}

export interface AuthPayload {
  email: string;
  password: string;
  currentUserId: string;
}

export interface AuthErrorAction {
  type: string;
  payload: AuthError;
}

export interface SignedInAction {
  type: string;
  payload: string;
}
