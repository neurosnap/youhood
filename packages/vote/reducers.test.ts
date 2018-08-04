import { votes } from './reducers';
import { addVotes, downvote, upvote, unvote } from './actions';
import { Votes } from './types';

describe('votes', () => {
  describe('when upvote is dispatched', () => {
    it('should upvote hood', () => {
      const data: Votes = {
        1: {
          2: 'upvote',
        },
      };

      const action = upvote({ userId: '5', hoodId: '3' });
      const actual = votes(data, action);
      const expected = {
        1: {
          2: 'upvote',
        },
        3: {
          5: 'upvote',
        },
      };

      expect(actual).toEqual(expected);
    });
  });

  describe('when downvote is dispatched', () => {
    describe('when hood does not exist in votes', () => {
      it('should downvote', () => {
        const data: Votes = {
          1: {
            2: 'upvote',
          },
        };

        const action = downvote({ userId: '5', hoodId: '8' });
        const actual = votes(data, action);
        const expected = {
          1: {
            2: 'upvote',
          },
          8: {
            5: 'downvote',
          },
        };

        expect(actual).toEqual(expected);
      });
    });

    it('should downvote hood', () => {
      const data: Votes = {
        1: {
          2: 'upvote',
        },
      };

      const action = downvote({ userId: '5', hoodId: '3' });
      const actual = votes(data, action);
      const expected = {
        1: {
          2: 'upvote',
        },
        3: {
          5: 'downvote',
        },
      };

      expect(actual).toEqual(expected);
    });
  });

  describe('when unvote is dispatched', () => {
    it('should unvote hood', () => {
      const data: Votes = {
        1: {
          2: 'upvote',
        },
        3: {
          5: 'upvote',
        },
      };

      const action = unvote({ userId: '5', hoodId: '3', voteType: 'upvote' });
      const actual = votes(data, action);
      const expected = {
        1: {
          2: 'upvote',
        },
        3: {},
      };

      expect(actual).toEqual(expected);
    });
  });

  describe('when addVotes is dispatched', () => {
    it('should add votes to the state', () => {
      const upvote = 'upvote';
      const downvote = 'downvote';
      const data: Votes = {
        1: {
          2: upvote,
          3: downvote,
          4: upvote,
        },
        2: {
          2: upvote,
        },
      };
      const state: Votes = {
        2: {
          2: downvote,
          5: upvote,
        },
        3: {
          6: upvote,
        },
      };
      const action = addVotes(data);
      const actual = votes(state, action);
      const expected = {
        1: {
          2: upvote,
          3: downvote,
          4: upvote,
        },
        2: {
          2: upvote,
          5: upvote,
        },
        3: {
          6: upvote,
        },
      };

      expect(actual).toEqual(expected);
    });
  });
});
