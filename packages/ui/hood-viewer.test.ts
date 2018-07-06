import { mount } from 'enzyme';
import * as h from 'react-hyperscript';

import { HoodViewer } from './hood-viewer';
import { Voted, VoteUp, Link } from './ui';

const tmpUser = {
  email: '123',
  id: '123',
  isTmp: true,
};
const regUser = {
  email: 'eric@cool.com',
  id: '123',
  isTmp: false,
};
const hood = {
  id: '321',
  city: 'Ann Arbor',
  state: 'Michigan',
  county: 'Washtenaw',
  createdAt: '2018-01-01',
  updatedAt: '2018-01-01',
  userId: tmpUser.id,
  name: 'Da Hood',
};

describe('HoodView', () => {
  describe('when the user is temporary', () => {
    it('should render `Anonymous` user name', () => {
      const tree = mount(
        h(HoodViewer, {
          hood,
          hoodId: hood.id,
          currentUserId: tmpUser.id,
          user: tmpUser,
        }),
      );

      expect(tree).toMatchSnapshot();
    });
  });

  describe('when the user has registered', () => {
    it('should render the email as user', () => {
      const tree = mount(
        h(HoodViewer, {
          hood,
          hoodId: hood.id,
          user: regUser,
        }),
      );

      expect(tree).toMatchSnapshot();
    });
  });

  describe('when the user can vote on hood', () => {
    describe('when the user has not voted yet', () => {
      const handleVote = jest.fn();
      const tree = mount(
        h(HoodViewer, {
          hood,
          hoodId: hood.id,
          user: regUser,
          userVoted: false,
          canUserVote: true,
          handleVote,
          currentUserId: regUser.id,
        }),
      );
      const vote = tree.find(VoteUp);

      it('should display the upvote arrow', () => {
        expect(vote.length).toEqual(1);
      });

      describe('when the user clicks the upvote arrow', () => {
        it('should call handleVote', () => {
          vote.simulate('click');
          expect(handleVote).toHaveBeenCalledWith('321', regUser.id);
        });
      });
    });

    describe('when the user has voted', () => {
      const handleUnvote = jest.fn();
      const tree = mount(
        h(HoodViewer, {
          hood,
          hoodId: hood.id,
          user: regUser,
          userVoted: true,
          canUserVote: true,
          handleUnvote,
          currentUserId: regUser.id,
        }),
      );
      const vote = tree.find(Voted);

      it('should display the voted arrow', () => {
        expect(vote.length).toEqual(1);
      });

      describe('when the user clicks the upvote arrow', () => {
        it('should call handleUnvote', () => {
          vote.simulate('click');
          expect(handleUnvote).toHaveBeenCalledWith('321', regUser.id);
        });
      });
    });
  });

  describe('when the user can edit the hood', () => {
    describe('when the user is temporary', () => {
      it('should display edit button', () => {
        const tree = mount(
          h(HoodViewer, {
            hood,
            hoodId: hood.id,
            user: tmpUser,
            canEdit: true,
          }),
        );

        expect(tree.find(Link).length).toEqual(1);
      });
    });
  });
});
