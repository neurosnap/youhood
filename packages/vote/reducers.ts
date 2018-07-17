import {
  Votes,
  VoteList,
  AddVotesAction,
  VoteAction,
  VotePayload,
} from './types';

import { addVotes, vote, removeVotes } from './actions';
import * as selectors from './selectors';

const votes = (state: Votes = {}, action: AddVotesAction | VoteAction) => {
  switch (action.type) {
    case `${addVotes}`: {
      const newVotes = <Votes>action.payload;
      const nextState: Votes = {};

      Object.keys(newVotes).forEach((hoodId) => {
        if (!state.hasOwnProperty(hoodId)) {
          nextState[hoodId] = newVotes[hoodId];
          return;
        }

        nextState[hoodId] = addVotesToList(newVotes[hoodId], state[hoodId]);
      });

      return nextState;
    }

    case `${removeVotes}`: {
      const removeVotes = <Votes>action.payload;
      const nextState: Votes = {};

      Object.keys(removeVotes).forEach((hoodId) => {
        if (!state.hasOwnProperty(hoodId)) {
          return;
        }

        nextState[hoodId] = removeVotesFromList(
          removeVotes[hoodId],
          state[hoodId],
        );
      });

      return nextState;
    }

    case `${vote}`: {
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

function addVotesToList(votes: VoteList, list: VoteList): VoteList {
  return Array.from(new Set([...list, ...votes]));
}

function removeVotesFromList(votes: VoteList, list: VoteList): VoteList {
  const setList = new Set(list);
  votes.forEach((val: string) => setList.delete(val));
  return Array.from(setList);
}
