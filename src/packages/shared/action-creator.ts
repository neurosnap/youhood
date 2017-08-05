/* @flow */
type ActionType = string;
type ActionPayload = any;
type Action = {
  type: ActionType,
  payload: ActionPayload,
};

export default (type: ActionType) =>
  (payload: ActionPayload): Action => ({
    type,
    payload,
  });
