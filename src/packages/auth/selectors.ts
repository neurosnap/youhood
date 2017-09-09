import { State } from '../../types';

export const token = 'token';
export const authError = 'authError';

export const getToken = (state: State) => state[token];
export const getAuthError = (state: State) => state[authError];
export const isUserAuthenticated = (state: State) => !!getToken(state);
