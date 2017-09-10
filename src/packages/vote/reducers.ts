import { Votes } from '../../types';

import { ADD_VOTES, VOTE } from './action-types';
import { AddVotesAction, VoteAction, VotePayload } from './action-creators';
import * as selectors from './selectors';

const votes = (state: Votes = {}, action: AddVotesAction | VoteAction) => {
  switch (action.type) {
  case ADD_VOTES: {
    const newVotes = <Votes>action.payload;
    return { ...state, ...newVotes };
  }

  case VOTE: {
    const { hoodId, userId } = <VotePayload>action.payload;
    if (state.hasOwnProperty(hoodId)) {
      if (state[hoodId].indexOf(userId) >= 0) {
        return state;
      }
    }

    state[hoodId] = [userId];
  }

  default:
    return state;
  }
};

export default {
  [selectors.votes]: votes,
};
