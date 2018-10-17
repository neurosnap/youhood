import { mount } from 'enzyme';
import * as h from 'react-hyperscript';

import { DrawHood } from './draw';

describe('DrawHood', () => {
  describe('when user is not logged in', () => {
    it('should not render', () => {
      const tree = mount(h(DrawHood, { isUserLoggedIn: false }));
      expect(tree.html()).toBe(null);
    });
  });

  describe('when `isEditing` is true', () => {
    it('should render the cancel button', () => {
      const tree = mount(
        h(DrawHood, { isEditing: true, isUserLoggedIn: true }),
      );
      expect(tree).toMatchSnapshot();
    });
  });

  describe('when `isEditing` is false', () => {
    it('should render the create button', () => {
      const tree = mount(
        h(DrawHood, { isEditing: false, isUserLoggedIn: true }),
      );
      expect(tree).toMatchSnapshot();
    });
  });
});
