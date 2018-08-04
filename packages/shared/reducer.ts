import createNextState from 'immer';
import { Action } from 'redux';

interface ActionsMap<S> {
  [key: string]: (state: S, action: Action) => S | void;
}

export default function createReducer<S>(
  initialState: S,
  actionsMap: ActionsMap<S>,
) {
  return (state: S = initialState, action: Action) => {
    return createNextState(<any>state, (draft: S) => {
      const caseReducer = actionsMap[action.type];

      if (caseReducer) {
        return caseReducer(draft, action);
      }

      return draft;
    });
  };
}
