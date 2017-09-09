import * as h from 'react-hyperscript';
import { connect } from 'react-redux';

import { actionCreators } from '../../packages/auth';
const { signOut } = actionCreators;

interface Props {
  handleSignOut: Function;
}

const Profile = ({ handleSignOut }: Props) => {
  return h('div.signin-menu-container', [
    h('div.signin-menu', [
      h('div.buttons', [
        h('div.nav-hover.button', { onClick: handleSignOut }, [
          h('div', 'Sign Out'),
        ]),
      ]),
    ]),
  ]);
};

export default connect(null, (dispatch: Function) => ({
  handleSignOut: () => dispatch(signOut()),
}))(Profile as any);
