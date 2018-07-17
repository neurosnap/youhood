import { shallow } from 'enzyme';
import * as h from 'react-hyperscript';

import { SignIn } from './signin';
import { NavHover } from './ui';
import Profile from './profile';
import AuthMenu from './auth';

describe('SignIn', () => {
  describe('when user is not authenticated', () => {
    it('should render text `Sign In`', () => {
      const tree = shallow(h(SignIn, { authenticated: false }));
      expect(tree.find('a').text()).toEqual('Sign In');
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
      expect(tree.find('a').text()).toEqual('eric@cool.com');
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

    describe('when the user is authenticated', () => {
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
  });
});
