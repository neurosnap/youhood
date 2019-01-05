import { shallow } from 'enzyme';
import * as h from 'react-hyperscript';

import { UserMenu, Inner } from './user-menu';
import { NavHover } from './ui';
import Profile from './profile';
import AuthMenu from './auth';

jest.useFakeTimers();

describe('UserMenu', () => {
  describe('when user is not authenticated', () => {
    it('should render text `Sign In`', () => {
      const tree = shallow(h(UserMenu, { authenticated: false }));
      expect(tree.find(Inner).html()).toContain('Sign In');
    });
  });

  describe('when user is authenticated', () => {
    it('should render text of users email', () => {
      const tree = shallow(
        h(UserMenu, {
          authenticated: true,
          user: { email: 'eric@cool.com' },
        }),
      );
      expect(tree.find(Inner).html()).toContain('eric@cool.com');
    });
  });

  describe('when menu is open', () => {
    describe('when the user is authenticated', () => {
      it('should render Profile component', () => {
        const tree = shallow(
          h(UserMenu, {
            authenticated: true,
            user: { email: 'eric@cool.com' },
          }),
        );

        tree.find(NavHover).simulate('click');

        expect(tree.find(Profile).length).toEqual(1);
      });
    });

    describe('when the user is not authenticated', () => {
      it('should render UserMenuMenu component', () => {
        const tree = shallow(
          h(UserMenu, {
            authenticated: false,
            user: { email: 'eric@cool.com' },
          }),
        );

        tree.find(NavHover).simulate('click');

        expect(tree.find(AuthMenu).length).toEqual(1);
      });
    });

    describe('clicking outside of the sign in popup', () => {
      it('should close the popup', () => {
        const ev = { currentTarget: { contains: () => false } };
        const doc = {};
        const tree = shallow(
          h(UserMenu, {
            authenticated: false,
            user: { email: 'eric@cool.com' },
          }),
        );
        tree.setState({ open: true });
        const instance = tree.instance() as UserMenu;
        instance.onBlur(ev, doc);
        jest.runAllTimers();
        expect(tree.state()).toEqual({ open: false });
      });
    });
  });
});
