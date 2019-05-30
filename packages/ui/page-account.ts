import * as h from 'react-hyperscript';
import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { WebState, ApiKey, User } from '@youhood/types';
import { selectors as userSelectors } from '@youhood/user';
const { getCurrentUser } = userSelectors;
import { actions as accountActions, selectors } from '@youhood/account';
const { fetchApiKeys } = accountActions;
const { getApiKeys } = selectors;

import NavbarStatic from './navbar-static';
import { formatDate } from './date';

const AccountView = styled.div`
  display: flex;
  justify-content: center;
`;
const AccountContainer = styled.div`
  margin-top: 10px;
  width: 50%;
`;
const Flex = styled.div`
  display: flex;
  align-items: space-between;
  margin: 1rem 0;
  border-bottom: 1px solid #ccc;
`;
const Label = styled.div`
  width: 30%;
`;
const Content = styled.div`
  flex: 1;
`;

interface IProps {
  user: User;
  apiKeys: ApiKey[];
  fetchKeys: () => void;
}

class Account extends Component<IProps> {
  componentWillMount() {
    const { fetchKeys } = this.props;
    fetchKeys();
  }

  render() {
    const { user, apiKeys } = this.props;
    return h(Fragment, [
      h(NavbarStatic),
      h(AccountView, [
        h(AccountContainer, [
          h(Flex, [h(Label, 'email'), h(Content, user.email)]),
          h(Flex, [
            h(Label, 'created at'),
            h(Content, formatDate(user.createdAt || '')),
          ]),
          h(Flex, [
            h(Label, 'api keys'),
            h(
              Content,
              apiKeys.map((key) => {
                return h('div', { key: key.apiKey }, key.apiKey);
              }),
            ),
          ]),
        ]),
      ]),
    ]);
  }
}

const mapState = (state: WebState) => {
  return {
    user: getCurrentUser(state),
    apiKeys: getApiKeys(state),
  };
};
const mapDispatch = (dispatch: any) => {
  return {
    fetchKeys: () => dispatch(fetchApiKeys()),
  };
};

export default connect(
  mapState,
  mapDispatch,
)(Account);
