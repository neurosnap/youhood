import { shallow } from 'enzyme';
import * as h from 'react-hyperscript';

import { Profile } from './profile';
import { Link } from './ui';

describe('Profile', () => {
  describe('when signout is clicked', () => {
    it('should call `handleSignOut`', () => {
      const handleSignOut = jest.fn();
      const tree = shallow(h(Profile, { handleSignOut }));
      tree
        .find(Link)
        .at(1)
        .simulate('click');
      expect(handleSignOut).toHaveBeenCalled();
    });
  });
});
