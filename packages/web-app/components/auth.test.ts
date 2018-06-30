import { shallow } from 'enzyme';
import * as h from 'react-hyperscript';

import { Auth } from './auth';
import { Input } from './ui';

describe('SignInMenu', () => {
  describe('when clicking the sign in button', () => {
    it('should call handleSignIn with correct data', () => {
      const onClick = jest.fn();
      const tree = shallow(h(Auth, {
        currentUserId: '1337',
        onClick,
      }));

      const inputs = tree.find(Input);
      const email = inputs.at(0);
      const password = inputs.at(1);
      email.simulate('change', { currentTarget: { value: 'eric@cool.com' } });
      password.simulate('change', { currentTarget: { value: '12345' } });
      (tree.instance() as any).handleClick();

      expect(onClick).toHaveBeenCalledWith({
        email: 'eric@cool.com',
        password: '12345',
        currentUserId: '1337',
      });
    });
  });
});
