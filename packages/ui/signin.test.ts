import { shallow } from 'enzyme';
import * as h from 'react-hyperscript';

import { SignIn } from './signin';
import { NavHover, SignInEl } from './ui';
import Profile from './profile';
import AuthMenu from './auth';

jest.useFakeTimers();

describe('SignIn', () => {
  describe('when user is not authenticated', () => {
    it('should render text `Sign In`', () => {
      const tree = shallow(h(SignIn, { authenticated: false }));
      expect(tree.find(SignInEl).html()).toContain('Sign In');
    });
  });

  describe('when user is authenticated', () => {
    it('should render text of users email', () => {
      const tree = shallow(
        h(SignIn, {
          authenticated: true,
          user: { email: 'eric@cool.com' },
        }),
      );
      expect(tree.find(SignInEl).html()).toContain('eric@cool.com');
    });
  });

  describe('when menu is open', () => {
    describe('when the user is authenticated', () => {
      it('should render Profile component', () => {
        const tree = shallow(
          h(SignIn, {
            authenticated: true,
            user: { email: 'eric@cool.com' },
          }),
        );

        tree.find(NavHover).simulate('click');

        expect(tree.find(Profile).length).toEqual(1);
      });
    });

    describe('when the user is not authenticated', () => {
      it('should render SignInMenu component', () => {
        const tree = shallow(
          h(SignIn, {
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
          h(SignIn, {
            authenticated: false,
            user: { email: 'eric@cool.com' },
          }),
        );
        tree.setState({ open: true });
        const instance = tree.instance() as SignIn;
        instance.onBlur(ev, doc);
        jest.runAllTimers();
        expect(tree.state()).toEqual({ open: false });
      });
    });
  });
});
