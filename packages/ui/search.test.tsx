import * as React from 'react';
import { shallow } from 'enzyme';

import { SearchView } from './search';
import { SearchInput } from './ui';

describe('SearchView', () => {
  describe('when user types', () => {
    it('should not activate handleSearch', () => {
      const handleSearch = jest.fn();
      const tree = shallow(<SearchView handleSearch={handleSearch} />);
      tree
        .find(SearchInput)
        .simulate('keypress', { key: 'e', currentTarget: { value: 'same' } });
      expect(handleSearch).not.toHaveBeenCalled();
    });
  });

  describe('when user hits submit', () => {
    it('should activate handleSearch', () => {
      const handleSearch = jest.fn();
      const tree = shallow(<SearchView handleSearch={handleSearch} />);
      tree.find(SearchInput).simulate('keypress', {
        key: 'Enter',
        currentTarget: { value: 'same' },
      });
      expect(handleSearch).toHaveBeenCalledWith('same');
    });
  });
});
