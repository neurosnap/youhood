import { shallow } from 'enzyme';
import * as h from 'react-hyperscript';

import { SignIn } from './signin';
import { Input, Button } from './ui';

describe('SignIn', () => {
  describe('when clicking the button', () => {
    it('should call onclick with correct data', () => {
      const onClick = jest.fn();
      const tree = shallow(
        h(SignIn, {
          error: '',
          onClick,
          currentUserId: '1337',
        }),
      );

      const inputs = tree.find(Input);
      const email = inputs.at(0);
      const password = inputs.at(1);
      email.simulate('change', { currentTarget: { value: 'eric@cool.com' } });
      password.simulate('change', { currentTarget: { value: '12345' } });
      tree.find(Button).simulate('click');

      expect(onClick).toHaveBeenCalledWith({
        email: 'eric@cool.com',
        password: '12345',
        currentUserId: '1337',
      });
    });
  });

  describe('when email and password is empty', () => {
    it('should disable the button', () => {
      const tree = shallow(h(SignIn));
      const btn = tree.find(Button);
      expect(btn.props().disabled).toEqual(true);
    });
  });

  describe('when email is empty', () => {
    it('should disable the button', () => {
      const tree = shallow(h(SignIn));
      const inputs = tree.find(Input);
      const password = inputs.at(1);
      password.simulate('change', { currentTarget: { value: '12345' } });
      const btn = tree.find(Button);
      expect(btn.props().disabled).toEqual(true);
    });
  });

  describe('when password is empty', () => {
    it('should disable the button', () => {
      const tree = shallow(h(SignIn));
      const inputs = tree.find(Input);
      const email = inputs.at(0);
      email.simulate('change', { currentTarget: { value: 'eric@cool.com' } });
      const btn = tree.find(Button);
      expect(btn.props().disabled).toEqual(true);
    });
  });
});
