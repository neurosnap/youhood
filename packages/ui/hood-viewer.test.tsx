import * as React from 'react';
import { mount } from 'enzyme';

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
  createdAt: '2018-01-01T00:00:00Z',
  updatedAt: '2018-01-01T00:00:00Z',
  userId: tmpUser.id,
  name: 'Da Hood',
  votes: 0,
};

describe('HoodView', () => {
  describe('when the user is temporary', () => {
    it('should render `Anonymous` user name', () => {
      const tree = mount(
        <HoodViewer
          hood={hood}
          hoodId={hood.id}
          currentUserId={tmpUser.id}
          user={tmpUser}
          userVoteType="unknown"
          canEdit={false}
          canUserVote={false}
          edit={(p: any) => {}}
          handleUnvote={() => {}}
          handleUpvote={() => {}}
          handleDownvote={() => {}}
          userVoted={false}
          votes={0}
        />,
      );

      expect(tree).toMatchSnapshot();
    });
  });

  describe('when the user has registered', () => {
    it('should render the email as user', () => {
      const tree = mount(
        <HoodViewer
          hood={hood}
          hoodId={hood.id}
          user={regUser}
          currentUserId={regUser.id}
          userVoteType="unknown"
          canEdit={false}
          canUserVote={false}
          edit={(p: any) => {}}
          handleUnvote={() => {}}
          handleUpvote={() => {}}
          handleDownvote={() => {}}
          userVoted={false}
          votes={0}
        />,
      );

      expect(tree).toMatchSnapshot();
    });
  });

  describe('when the user can vote on hood', () => {
    describe('when the user has not voted yet', () => {
      const handleUpvote = jest.fn();
      const tree = mount(
        <HoodViewer
          hood={hood}
          hoodId={hood.id}
          user={regUser}
          userVoted={false}
          canUserVote={true}
          handleUpvote={handleUpvote}
          currentUserId={regUser.id}
          userVoteType="unknown"
          canEdit={false}
          edit={(p: any) => {}}
          handleUnvote={() => {}}
          handleDownvote={() => {}}
          votes={0}
        />,
      );
      const upvote = tree.find(VoteUp).at(0);

      it('should display the upvote arrow', () => {
        expect(upvote.length).toEqual(1);
      });

      describe('when the user clicks the upvote arrow', () => {
        it('should call handleVote', () => {
          upvote.simulate('click');
          expect(handleUpvote).toHaveBeenCalledWith('321', regUser.id);
        });
      });
    });

    describe('when the user has voted', () => {
      const handleUnvote = jest.fn();
      const tree = mount(
        <HoodViewer
          hood={hood}
          hoodId={hood.id}
          user={regUser}
          userVoted={true}
          userVoteType="upvote"
          canUserVote={true}
          handleUnvote={handleUnvote}
          currentUserId={regUser.id}
          canEdit={false}
          edit={(p: any) => {}}
          handleUpvote={() => {}}
          handleDownvote={() => {}}
          votes={0}
        />,
      );
      const vote = tree.find(Voted);

      it('should display the voted arrow', () => {
        expect(vote.length).toEqual(1);
      });

      describe('when the user clicks the upvote arrow', () => {
        it('should call handleUnvote', () => {
          vote.simulate('click');
          expect(handleUnvote).toHaveBeenCalledWith(
            '321',
            regUser.id,
            'upvote',
          );
        });
      });
    });
  });

  describe('when the user can edit the hood', () => {
    describe('when the user is temporary', () => {
      it('should display edit button', () => {
        const tree = mount(
          <HoodViewer
            hood={hood}
            hoodId={hood.id}
            user={tmpUser}
            canEdit={true}
            currentUserId={regUser.id}
            userVoteType="unknown"
            canUserVote={false}
            edit={(p: any) => {}}
            handleUnvote={() => {}}
            handleUpvote={() => {}}
            handleDownvote={() => {}}
            userVoted={false}
            votes={0}
          />,
        );

        expect(tree.find(Link).length).toEqual(1);
      });
    });
  });
});
