import { actions } from '@youhood/hood';
const { afterSaveHood } = actions;
import { actions as voteActions } from '@youhood/vote';
const { upvote } = voteActions;

import { PointMap } from './types';

export default <PointMap>{
  [`${afterSaveHood}`]: 10,
  [`${upvote}`]: 1,
};
