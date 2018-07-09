import * as h from 'react-hyperscript';
import { connect } from 'react-redux';

import { actions } from '@youhood/auth';
const { signOut } = actions;

import {
  DropdownMenuContainer,
  SignInMenuEl,
  Buttons,
  DropdownMenuButton,
} from './ui';

interface Props {
  handleSignOut: (e: React.MouseEvent<HTMLButtonElement>) => void;
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

export default connect(
  null,
  (dispatch: Function) => ({
    handleSignOut: () => dispatch(signOut()),
  }),
)(Profile as any);
