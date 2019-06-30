import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { actions } from '@youhood/auth';
const { signOut } = actions;

import { DropdownMenuContainer, SignInMenuEl, Link } from './ui';

const Links = styled.div`
  display: flex;
  flex-direction: column;
`;

interface Props {
  handleSignOut: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const Profile = ({ handleSignOut }: Props) => {
  return (
    <DropdownMenuContainer>
      <SignInMenuEl>
        <Links>
          <Link href="/account">Account</Link>
          <Link href="/signout" onClick={handleSignOut}>
            Sign Out
          </Link>
        </Links>
      </SignInMenuEl>
    </DropdownMenuContainer>
  );
};

export default connect(
  null,
  (dispatch: Function) => ({
    handleSignOut: (e: any) => {
      e.preventDefault();
      dispatch(signOut());
    },
  }),
)(Profile as any);
