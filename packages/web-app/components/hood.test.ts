import { mount } from 'enzyme';
import * as h from 'react-hyperscript';

import { HoodView } from './hood';
import { Voted, VoteUp } from './ui';

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

describe('HoodView', () => {
  it('should render null', () => {
    const tree = mount(h(HoodView));
    expect(tree).toMatchSnapshot();
  });

  describe('when the user is temporary', () => {
    it('should render `Anonymous` user name', () => {
      const tree = mount(h(HoodView, {
        show: true,
        hoodId: '321',
        user: tmpUser,
      }));

      expect(tree).toMatchSnapshot();
    });
  });

  describe('when the user has registered', () => {
    it('should render the email as user', () => {
      const tree = mount(h(HoodView, {
        show: true,
        hoodId: '321',
        user: regUser,
      }));

      expect(tree).toMatchSnapshot();
    });
  });

  describe('when the user can vote on hood', () => {
    describe('when the user has not voted yet', () => {
      const handleVote = jest.fn();
      const tree = mount(h(HoodView, {
        show: true,
        hoodId: '321',
        user: regUser,
        userVoted: false,
        canUserVote: true,
        handleVote,
        currentUserId: regUser.id,
      }));
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
      const tree = mount(h(HoodView, {
        show: true,
        hoodId: '321',
        user: regUser,
        userVoted: true,
        canUserVote: true,
        handleUnvote,
        currentUserId: regUser.id,
      }));
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
        const tree = mount(h(HoodView, {
          show: true,
          hoodId: '321',
          user: tmpUser,
          canEdit: true,
        }));

        expect(tree.find('.edit').length).toEqual(1);
      });
    });

    describe('when the user has registered', () => {
      const tree = mount(h(HoodView, {
        show: true,
        hoodId: '321',
        user: regUser,
        canEdit: true,
      }));

      expect(tree.find('.edit').length).toEqual(1);
    });
  });

  describe('when the user is editing hood', () => {
    const edit = jest.fn();
    const tree = mount(h(HoodView, {
      show: true,
      hoodId: '333',
      user: regUser,
      canEdit: true,
      hood: {
        id: '333',
        name: 'kerrytown',
      },
      edit,
    }));

    tree.find('.edit').simulate('click');

    describe('when clicking the edit button', () => {
      it('should set `editing` to true', () => {
        expect(tree.state('editing')).toEqual(true);
      });

      it('should call `edit`', ()  => {
        expect(edit).toHaveBeenCalledWith({ edit: true, hoodId: '333' });
      });
    });

    it('should render save button', () => {
      expect(tree.find('.save').length).toEqual(1);
    });

    it('should render the cancel button', () => {
      expect(tree.find('.cancel').length).toEqual(1);
    });

    it('should render input', () => {
      expect(tree.find('.name-input').length).toEqual(1);
    });

    it('should have the correct hood name', () => {
      expect(tree.find('.name-input').props().value).toEqual('kerrytown');
    });

    describe('when typing in name input', () => {
      it('should set state name to input value', () => {
        const input = tree.find('.name-input');
        input.simulate('change', { target: { value: 'downtown' } });
        expect(tree.state('name')).toEqual('downtown');
      });
    });
  });

  describe('when the user clicks the save button', () => {
    const save = jest.fn();
    const edit = jest.fn();
    const updateHoodName = jest.fn();

    const tree = mount(h(HoodView, {
      show: true,
      hoodId: '333',
      user: regUser,
      canEdit: true,
      hood: {
        id: '333',
        name: 'kerrytown',
      },
      save,
      edit,
      updateHoodName,
    }));

    // simulate editing a hood's name and saving it
    tree.find('.edit').simulate('click');
    const input = tree.find('.name-input');
    input.simulate('change', { target: { value: 'downtown' } });
    tree.find('.save').simulate('click');

    it('should call updateHoodName', () => {
      expect(updateHoodName).toHaveBeenCalledWith({ hoodId: '333', name: 'downtown' });
    });

    it('should set editing state to false', () => {
      expect(tree.state('editing')).toEqual(false);
    });

    it('should call `edit`', () => {
      expect(edit).toHaveBeenCalledWith({ hoodId: '333', edit: false });
    });

    it('should call `save`', () => {
      expect(save).toHaveBeenCalledWith('333');
    });
  });

  describe('when the user clicks the cancel button', () => {
    const edit = jest.fn();

    const tree = mount(h(HoodView, {
      show: true,
      hoodId: '333',
      user: regUser,
      canEdit: true,
      hood: {
        id: '333',
        name: 'kerrytown',
      },
      edit,
    }));

    // simulate editing a hood's name and cancelling it
    tree.find('.edit').simulate('click');
    const input = tree.find('.name-input');
    input.simulate('change', { target: { value: 'downtown' } });
    tree.find('.cancel').simulate('click');

    it('should revert name in state', () => {
      expect(tree.state('name')).toEqual('kerrytown');
    });

    it('should set editing in state to false', () => {
      expect(tree.state('editing')).toEqual(false);
    });

    it('should call `edit`', () => {
      expect(edit).toHaveBeenCalledWith({ hoodId: '333', edit: false });
    });
  });

  describe('when a new hood is selected', () => {
    it('should set name in state to new hood name', () => {
      const tree = mount(h(HoodView, {
        show: true,
        hoodId: '333',
        user: regUser,
        canEdit: true,
        hood: {
          id: '333',
          name: 'kerrytown',
        },
      }));

      tree.setProps({
        hoodId: '222',
        hood: {
          id: '222',
          name: 'wowza',
        },
      });

      expect(tree.state('name')).toEqual('wowza');
    });
  });
});
