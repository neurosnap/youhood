import { WebState } from '@youhood/types';

export const authError = 'authError';
export const getAuthError = (state: WebState) => state[authError];
