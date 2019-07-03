import * as React from 'react';
import { shallow } from 'enzyme';

import MenuDrawer from './menu';
import { Menu } from './ui';

describe('Menu', () => {
  describe('when the hamburger menu has been clicked', () => {
    it('should set state to `true`', () => {
      const tree = shallow(<MenuDrawer />);
      tree.find(Menu).simulate('click');
      expect(tree.state('show')).toEqual(true);
    });
  });

  it('should render menu', () => {
    const tree = shallow(<MenuDrawer />);
    expect(tree).toMatchSnapshot();
  });
});
