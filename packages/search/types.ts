export type Address = string;
export interface SearchAction {
  type: 'SEARCH';
  payload: Address;
}
