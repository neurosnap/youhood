import * as React from 'react';
import { mount } from 'enzyme';

import { DrawHood } from './draw';

describe('DrawHood', () => {
  describe('when user is not logged in', () => {
    it('should not render', () => {
      const tree = mount(
        <DrawHood
          isUserLoggedIn={false}
          isEditing={false}
          handleCancelDrawHood={() => {}}
          handleDrawHood={() => {}}
        />,
      );
      expect(tree.html()).toBe(null);
    });
  });

  describe('when `isEditing` is true', () => {
    it('should render the cancel button', () => {
      const tree = mount(
        <DrawHood
          isEditing={true}
          isUserLoggedIn={true}
          handleCancelDrawHood={() => {}}
          handleDrawHood={() => {}}
        />,
      );
      expect(tree).toMatchSnapshot();
    });
  });

  describe('when `isEditing` is false', () => {
    it('should render the create button', () => {
      const tree = mount(
        <DrawHood
          isEditing={false}
          isUserLoggedIn={true}
          handleCancelDrawHood={() => {}}
          handleDrawHood={() => {}}
        />,
      );
      expect(tree).toMatchSnapshot();
    });
  });
});
