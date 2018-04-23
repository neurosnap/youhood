import { shallow } from 'enzyme';
import * as h from 'react-hyperscript';

import { SignInMenu } from './signin-menu';

describe('SignInMenu', () => {
  describe('when clicking the sign in button', () => {
    it('should call handleSignIn with correct data', () => {
      const handleSignIn = jest.fn();
      const tree = shallow(h(SignInMenu, {
        currentUserId: '1337',
        handleSignIn,
      }));
      tree.find('.signin-email')
        .simulate('change', { currentTarget: { value: 'eric@cool.com' } });
      tree.find('.signin-pass')
        .simulate('change', { currentTarget: { value: '12345' } });
      tree.find('.signin-btn').simulate('click');

      expect(handleSignIn).toHaveBeenCalledWith({
        email: 'eric@cool.com',
        password: '12345',
        currentUserId: '1337',
      });
    });
  });

  describe('when clicking the register button', () => {
    it('should call handleRegister with correct data', () => {
      const handleRegister = jest.fn();
      const tree = shallow(h(SignInMenu, {
        currentUserId: '1337',
        handleRegister,
      }));
      tree.find('.signin-email')
        .simulate('change', { currentTarget: { value: 'eric@cool.com' } });
      tree.find('.signin-pass')
        .simulate('change', { currentTarget: { value: '12345' } });
      tree.find('.register-btn').simulate('click');

      expect(handleRegister).toHaveBeenCalledWith({
        email: 'eric@cool.com',
        password: '12345',
        currentUserId: '1337',
      });
    });
  });
});
