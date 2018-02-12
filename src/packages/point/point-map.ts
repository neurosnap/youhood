import { actionTypes } from '../hood';
const { AFTER_SAVE_HOOD } = actionTypes;
import { actionTypes as voteActionTypes } from '../vote';
const { VOTE, UNVOTE } = voteActionTypes;

export default {
  [AFTER_SAVE_HOOD]: 10,
  [VOTE]: 1,
  [UNVOTE]: -1,
};
