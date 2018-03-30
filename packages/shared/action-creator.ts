export interface Action<T, P> {
  readonly type: T;
  readonly payload?: P;
}
type ActionType = string;

export default <P>(type: ActionType) =>
  (payload: P): Action<ActionType, P> => {
    if (typeof payload === 'undefined') return { type };

    return {
      type,
      payload,
    };
  };
