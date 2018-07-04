import { mount } from 'enzyme';
import * as h from 'react-hyperscript';

import { DrawHood } from './draw';

describe('DrawHood', () => {
  describe('when `isEditing` is true', () => {
    it('should render the cancel button', () => {
      const tree = mount(h(DrawHood, { isEditing: true }));
      expect(tree).toMatchSnapshot();
    });
  });

  describe('when `isEditing` is false', () => {
    it('should render the create button', () => {
      const tree = mount(h(DrawHood, { isEditing: false }));
      expect(tree).toMatchSnapshot();
    });
  });
});
