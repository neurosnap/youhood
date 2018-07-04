import * as h from 'react-hyperscript';
import { connect } from 'react-redux';

import { actionCreators } from '@youhood/auth';
const { signOut } = actionCreators;

import { 
  DropdownMenuContainer, 
  SignInMenuEl,
  Buttons,
  DropdownMenuButton,
} from './ui';

interface Props {
  handleSignOut: Function;
}

export const Profile = ({ handleSignOut }: Props) => {
  return h(DropdownMenuContainer, [
    h(SignInMenuEl, [
      h(Buttons, [
        h(DropdownMenuButton, { onClick: handleSignOut }, [
          h('div', 'Sign Out'),
        ]),
      ]),
    ]),
  ]);
};

export default connect(null, (dispatch: Function) => ({
  handleSignOut: () => dispatch(signOut()),
}))(Profile as any);
