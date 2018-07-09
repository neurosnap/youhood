import { actions } from '@youhood/hood';
const { afterSaveHood } = actions;
import { actionTypes as voteActionTypes } from '@youhood/vote';
const { VOTE, UNVOTE } = voteActionTypes;

import { PointMap } from './types';

export default <PointMap>{
  [`${afterSaveHood}`]: 10,
  [VOTE]: 1,
  [UNVOTE]: -1,
};
