type ActionType = string;
type ActionPayload = any;
interface Action {
  type: ActionType;
  payload: ActionPayload;
}

export default (type: ActionType) =>
  (payload: ActionPayload): Action => ({
    type,
    payload,
  });
