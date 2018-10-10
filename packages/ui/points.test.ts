import { shallow } from 'enzyme';
import * as h from 'react-hyperscript';

import { PointsView, DropMenu } from './points';
import { Points } from './ui';

describe('PointsView', () => {
  describe('when there are no points', () => {
    it('should render the trophy icon', () => {
      const tree = shallow(h(PointsView));
      expect(tree.find('.fa-trophy').length).toEqual(1);
    });

    describe('when clicking the button', () => {
      it('should set state to `open`', () => {
        const tree = shallow(h(PointsView));
        tree.find('.fa-trophy').simulate('click');
        expect(tree.state('open')).toEqual(true);
      });
    });
  });

  describe('when there are points', () => {
    describe('when rendering', () => {
      const tree = shallow(h(PointsView, { points: 10 }));

      it('should render the points', () => {
        expect(tree).toMatchSnapshot();
      });

      it('should render green color', () => {
        expect(tree.find(Points)).toHaveStyleRule(
          'background-color',
          '#5fba7d',
        );
      });
    });

    describe('when clicking the button', () => {
      it('should set state to `open`', () => {
        const tree = shallow(h(PointsView, { points: 5 }));
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
        const tree = shallow(
          h(DropMenu, {
            open: true,
          }),
        );
        expect(tree).toMatchSnapshot();
      });
    });

    describe('when there is a point history', () => {
      it('should render point history as a list', () => {
        const tree = shallow(
          h(DropMenu, {
            open: true,
            items: [
              { value: 10, reason: 'Something cool' },
              { value: 20, reason: 'Killin it' },
            ],
          }),
        );
        expect(tree).toMatchSnapshot();
      });
    });
  });

  describe('when it is not open', () => {
    it('should render null', () => {
      const tree = shallow(h(DropMenu));
      expect(tree).toMatchSnapshot();
    });
  });
});
