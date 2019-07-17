import * as React from 'react';
import { mount } from 'enzyme';

import { HoodVisible } from './hood-visible';

const noop = () => {};

describe('HoodVisible', () => {
  it('should render the buttons', () => {
    const tree = mount(
      <HoodVisible showAll={noop} hideAll={noop} showWinners={noop} />,
    );
    expect(tree).toMatchSnapshot();
  });
});
