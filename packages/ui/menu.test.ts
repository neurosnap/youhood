import { shallow } from 'enzyme';
import * as h from 'react-hyperscript';

import MenuDrawer from './menu';
import { Menu } from './ui';

describe('Menu', () => {
  describe('when the hamburger menu has been clicked', () => {
    it('should set state to `true`', () => {
      const tree = shallow(h(MenuDrawer));
      tree.find(Menu).simulate('click');
      expect(tree.state('show')).toEqual(true);
    });
  });

  it('should render menu', () => {
    const tree = shallow(h(MenuDrawer));
    expect(tree).toMatchSnapshot();
  });
});
