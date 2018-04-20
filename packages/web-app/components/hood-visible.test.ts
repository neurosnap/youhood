import { mount } from 'enzyme';
import * as h from 'react-hyperscript';

import { HoodVisible } from './hood-visible';

describe('HoodVisible', () => {
  it('should render the buttons', () => {
    const tree = mount(h(HoodVisible));
    expect(tree).toMatchSnapshot();
  });
});
