export type UserId = string;
export interface User {
  id: UserId;
  email: string;
  createdAt?: string;
  isTmp?: boolean;
}
export type Users = User[];
export interface UserHash {
  [key: string]: User;
}
export interface RawUser {
  id: UserId;
  email: string;
  created_at: string;
  is_tmp: boolean;
}