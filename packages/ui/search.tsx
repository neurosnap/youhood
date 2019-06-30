import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Component, KeyboardEvent } from 'react';

import { actions } from '@youhood/search';
const { search } = actions;
import { Address } from '@youhood/search/types';

import { Search, SearchInput } from './ui';

interface Props {
  handleSearch: (address: Address) => void;
}

export class SearchView extends Component<Props> {
  keyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') {
      return;
    }

    const address = e.currentTarget.value;
    const { handleSearch } = this.props;
    handleSearch(address);
  };

  render() {
    return (
      <Search>
        <SearchInput onKeyPress={this.keyPress} placeholder="Search" />
      </Search>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  handleSearch: (address: Address) => dispatch(search(address)),
});
export default connect(
  null,
  mapDispatchToProps,
)(SearchView as any);
