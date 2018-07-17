import { actions } from '@youhood/hood';
const { afterSaveHood } = actions;
import { actions as voteActions } from '@youhood/vote';
const { vote, unvote } = voteActions;

import { PointMap } from './types';

export default <PointMap>{
  [`${afterSaveHood}`]: 10,
  [`${vote}`]: 1,
  [`${unvote}`]: -1,
};
