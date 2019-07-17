import * as React from 'react';
import { shallow } from 'enzyme';

import { PointsView, DropMenu } from './points';
import { Points, Trophy } from './ui';

describe('PointsView', () => {
  describe('when there are no points', () => {
    it('should render the trophy icon', () => {
      const tree = shallow(<PointsView points={0} pointHistory={[]} />);
      expect(tree.find(Trophy).length).toEqual(1);
    });

    describe('when clicking the button', () => {
      it('should set state to `open`', () => {
        const tree = shallow(<PointsView points={0} pointHistory={[]} />);
        tree.find(Trophy).simulate('click');
        expect(tree.state('open')).toEqual(true);
      });
    });
  });

  describe('when there are points', () => {
    describe('when rendering', () => {
      const tree = shallow(<PointsView points={10} pointHistory={[]} />);

      it('should render the points', () => {
        expect(tree).toMatchSnapshot();
      });

      /* it('should render green color', () => {
        expect(tree.find(Points)).toHaveStyleRule(
          'background-color',
          '#5fba7d',
        );
      }); */
    });

    describe('when clicking the button', () => {
      it('should set state to `open`', () => {
        const tree = shallow(<PointsView points={5} pointHistory={[]} />);
        tree.find(Points).simulate('click');
        expect(tree.state('open')).toEqual(true);
      });
    });
  });
});

describe('DropMenu', () => {
  describe('when it is open', () => {
    describe('when there is no point history', () => {
      it('should render help text', () => {
        const tree = shallow(<DropMenu open={true} items={[]} />);
        expect(tree).toMatchSnapshot();
      });
    });

    describe('when there is a point history', () => {
      it('should render point history as a list', () => {
        const tree = shallow(
          <DropMenu
            open={true}
            items={[
              { value: 10, reason: 'Something cool' },
              { value: 20, reason: 'Killin it' },
            ]}
          />,
        );
        expect(tree).toMatchSnapshot();
      });
    });
  });

  describe('when it is not open', () => {
    it('should render null', () => {
      const tree = shallow(<DropMenu open={false} items={[]} />);
      expect(tree).toMatchSnapshot();
    });
  });
});
