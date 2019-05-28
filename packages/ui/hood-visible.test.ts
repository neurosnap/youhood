import { mount } from 'enzyme';
import * as h from 'react-hyperscript';

import { HoodVisible } from './hood-visible';

const noop = () => {};

describe('HoodVisible', () => {
  it('should render the buttons', () => {
    const tree = mount(
      h(HoodVisible, { showAll: noop, hideAll: noop, showWinners: noop }),
    );
    expect(tree).toMatchSnapshot();
  });
});
