export interface Action<T, P> {
  readonly type: T;
  readonly payload: P;
}
type ActionType = string;

export default function creator<P>(type: ActionType) {
  const action = (payload?: P): Action<ActionType, P> => ({
    type,
    payload,
  });

  action.toString = () => `${type}`;
  return action;
}

export const getType = (action: any) => `${action}`;
