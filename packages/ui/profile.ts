import * as h from 'react-hyperscript';
import { connect } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';

import { actions } from '@youhood/auth';
const { signOut } = actions;

import { DropdownMenuContainer, SignInMenuEl, Link } from './ui';
import theme from '@youhood/theme';

const Links = styled.div`
  display: flex;
  flex-direction: column;
`;

const RLink = styled(RouterLink)`
  color: ${theme.palette.font.primary};
  margin: 0 0.2rem;
`;

interface Props {
  handleSignOut: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const Profile = ({ handleSignOut }: Props) => {
  return h(DropdownMenuContainer, [
    h(SignInMenuEl, [
      h(Links, [
        h(RLink, { to: '/account' }, 'Account'),
        h(Link, { href: '/signout', onClick: handleSignOut }, 'Sign Out'),
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
