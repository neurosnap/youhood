import { Votes, AddVotesAction, VoteAction, VoteTypes } from './types';

import { unvote, addVotes, upvote, downvote } from './actions';
import * as selectors from './selectors';
import { createReducer } from 'robodux';

function addVotesFn(state: Votes, action: AddVotesAction) {
  const newVotes = action.payload;
  Object.keys(newVotes).forEach((hoodId) => {
    const hoodVotes = { ...state[hoodId], ...newVotes[hoodId] };
    state[hoodId] = hoodVotes;
  });
}

const unvoteFn = (state: Votes, action: VoteAction) => {
  const { hoodId, userId } = action.payload;

  if (!state[hoodId]) {
    return;
  }

  if (!state[hoodId][userId]) {
    return;
  }

  delete state[hoodId][userId];
};

const voteFn = (voteType: VoteTypes) => (state: Votes, action: VoteAction) => {
  const { hoodId, userId } = action.payload;

  if (!state[hoodId]) {
    state[hoodId] = {};
  }

  state[hoodId][userId] = voteType;
};

export const votes = createReducer({
  initialState: {},
  actions: {
    [`${addVotes}`]: addVotesFn,
    [`${upvote}`]: voteFn('upvote'),
    [`${downvote}`]: voteFn('downvote'),
    [`${unvote}`]: unvoteFn,
  },
});

export default {
  [selectors.votes]: votes,
};
