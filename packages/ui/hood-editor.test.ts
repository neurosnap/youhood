import { mount } from 'enzyme';
import * as h from 'react-hyperscript';

import { HoodEditor } from './hood-editor';
import { InputOverlay, LinkSuccess, LinkDanger } from './ui';

const tmpUser = {
  email: '123',
  id: '123',
  isTmp: true,
};

const hood = {
  id: '321',
  city: 'Ann Arbor',
  state: 'Michigan',
  county: 'Washtenaw',
  createdAt: '2018-01-01',
  updatedAt: '2018-01-01',
  userId: tmpUser.id,
  name: 'Da Hood',
};

describe('HoodEditor', () => {
  describe('when the user clicks the save button', () => {
    const save = jest.fn();
    const edit = jest.fn();
    const updateHoodName = jest.fn();

    const tree = mount(
      h(HoodEditor, {
        hood,
        edit,
        save,
        updateHoodName,
      }),
    );

    // simulate editing a hood's name and saving it
    const input = tree.find(InputOverlay);
    input.simulate('change', { target: { value: 'downtown' } });
    tree.find(LinkSuccess).simulate('click');

    it('should call updateHoodName', () => {
      expect(updateHoodName).toHaveBeenCalledWith({
        hoodId: '321',
        name: 'downtown',
      });
    });

    it('should call `edit`', () => {
      expect(edit).toHaveBeenCalledWith({ hoodId: '321', edit: false });
    });

    it('should call `save`', () => {
      expect(save).toHaveBeenCalledWith('321');
    });
  });

  describe('when the user clicks the cancel button', () => {
    const edit = jest.fn();

    const tree = mount(
      h(HoodEditor, {
        hood,
        edit,
      }),
    );

    // simulate editing a hood's name and cancelling it
    const input = tree.find(InputOverlay);
    input.simulate('change', { target: { value: 'downtown' } });
    tree.find(LinkDanger).simulate('click');

    it('should revert name in state', () => {
      expect(tree.state('name')).toEqual('Da Hood');
    });

    it('should call `edit`', () => {
      expect(edit).toHaveBeenCalledWith({ hoodId: '321', edit: false });
    });
  });
});
