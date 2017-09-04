import { connect } from 'react-redux';
import * as h from 'react-hyperscript';

import { State, Hood, User } from '../../types';
import {
  utils,
  selectors,
} from '../../packages/hood';
const { getHoodSelected } = selectors;
const { getHoodName } = utils;
import { selectors as userSelectors } from '../../packages/user';
const { getUserById } = userSelectors;

interface Props {
  hood: Hood;
  user: User;
  show: boolean;
}

const HoodView = ({ hood = null, user = null, show = false }: Props) => {
  if (!show) return null;
  const hoodName = getHoodName(hood);

  return h('div.overlay.hood', [
    h('div', [
      h('div', [
        h('span', 'User: '),
        h('span', user.name),
      ]),
      h('div', hoodName),
    ]),
  ]);
};

export default connect(
  (state: State) => {
    const hood = getHoodSelected(state);
    if (!hood) return { hood: null, user: null };
    const user = getUserById(state, { id: hood.properties.userId });

    return {
      hood,
      user,
    };
  },
)(HoodView as any);
