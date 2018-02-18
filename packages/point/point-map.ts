import { actionTypes } from '@youhood/hood';
const { AFTER_SAVE_HOOD } = actionTypes;
import { actionTypes as voteActionTypes } from '@youhood/vote';
const { VOTE, UNVOTE } = voteActionTypes;

import { PointMap } from './types';

export default <PointMap>{
  [AFTER_SAVE_HOOD]: 10,
  [VOTE]: 1,
  [UNVOTE]: -1,
};
