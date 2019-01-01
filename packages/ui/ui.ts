import styled from 'styled-components';
import * as h from 'react-hyperscript';

import theme from '@youhood/theme';

export const Header = styled.h1`
  font-size: ${theme.font.size.header.large};
`;

export const HeaderSmall = styled.h2`
  font-size: ${theme.font.size.header.small};
  margin-bottom: 0.5rem;
`;

export const Link = styled.a`
  margin: 0 0.2rem;
  color: ${theme.palette.font.primary};
`;

export const LinkDanger = styled(Link)`
  color: ${theme.palette.error};
`;

export const LinkSuccess = styled(Link)`
  color: ${theme.palette.success};
`;

export const InputBase = styled.input`
  margin: 0;
  outline: none;
`;

export const TextSmall = styled.div`
  font-size: ${theme.font.size.small};
  display: flex;
  justify-content: space-between;
`;

// derived

export const InputOverlay = styled(InputBase)`
  padding: 0.375rem 0.75rem;
  color: ${theme.palette.font.input};
  background-color: ${theme.palette.bg.secondary};
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  width: 100%;
`;

const OverlaySection = styled.div`
  background-color: ${theme.palette.bg.secondary};
  border-radius: 0.3rem;
  padding: 0.6rem;
`;

export const HoodContainer = styled(OverlaySection)`
  display: flex;
`;
export const HoodEditorContainer = OverlaySection;

export const HoodSelectionContainer = styled(OverlaySection)`
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5rem;
`;

export const HoodSelectionItem = styled.div`
  display: flex;
  align-items: center;
  margin: 0.2rem 0;
`;

export const HoodVisibility = styled.div`
  cursor: pointer;
  font-size: ${theme.font.size.small};
`;

export const Votes = styled.div`
  padding: 0 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const VoteUp = styled.div`
  cursor: pointer;
`;

export const Voted = styled(VoteUp)`
  color: orange;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const EditorActions = styled(Actions)`
  margin-top: 0.5rem;
`;

export const HoodBaseItem = styled.div`
  cursor: pointer;
  padding: 0.3rem 0.4rem;
  border-radius: 0.3rem;
  flex: 1;
  margin-left: 0.3rem;
`;

export const HoodListItem = styled(HoodBaseItem)`
  :hover {
    background-color: ${theme.palette.hood.hover};
  }
`;

export const HoodListItemSelected = styled(HoodBaseItem)`
  background-color: ${theme.palette.hood.selected};
`;

export const OverlayHeader = styled.div`
  font-size: ${theme.font.size.normal};
  color: ${theme.palette.font.primary};
  display: flex;
  align-items: center;
  margin-bottom: 0.6rem;
`;

export const OverlayContainer = styled.div`
  width: 90%;
  margin-top: 0.5rem;
`;

export const NavHover = styled.button`
  cursor: pointer;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 0.4rem;
  margin: 0 0.4rem;
  background: inherit;
  color: inherit;
  border: none;
  font: inherit;
  cursor: pointer;
  outline: inherit;

  :hover:enabled {
    background-color: ${theme.palette.bg.input.hover};
  }

  :disabled {
    color: ${theme.palette.font.disabled};
  }
`;

export const HoodBarButton = styled(NavHover)`
  font-size: ${theme.font.size.small};
`;

export const Input = styled(InputBase)`
  margin: 0.4rem;
  padding: 0.4rem;
  border-radius: 0.1rem;
  height: 3rem;
  border: none;
  background-image: none;
  background-color: ${theme.palette.bg.input.normal};
  box-shadow: none;
  width: 90%;
  color: ${theme.palette.font.primary};
  font-size: ${theme.font.size.normal};

  :hover {
    background-color: ${theme.palette.bg.input.hover};
  }

  ::-webkit-input-placeholder {
    color: #eee;
  }
`;

export const SigninMsgBase = styled.div`
  height: 2rem;
`;

export const ErrorText = styled(SigninMsgBase)`
  color: ${theme.palette.font.error};
  background-color: ${theme.palette.bg.error};
  font-size: ${theme.font.size.small};
  padding: 0 0.5rem;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Buttons = styled.div`
  margin-top: 0.4rem;
  display: flex;
`;

export const Menu = styled(NavHover)`
  height: 2rem;
`;

export const Nav = styled.div`
  display: flex;
  align-items: center;
  height: 56px;
  box-sizing: border-box;
  background: ${theme.palette.bg.primary};
  top: 0;
  width: 100vw;
  color: ${theme.palette.font.primary};
`;

export const NavContent = styled.div`
  width: 100%;
  margin: 0 1.5rem;
  display: flex;
  align-items: center;
`;

export const NavLeft = styled.div`
  display: flex;
  align-items: center;
`;

export const NavRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.2rem;
  width: 75%;
`;

export const Search = styled.div`
  width: 40%;
  height: 100%;
  background-color: ${theme.palette.bg.input.normal};
  border-radius: 0.1rem;
  display: flex;
  align-items: center;

  :hover {
    background-color: ${theme.palette.bg.input.hover};
  }
`;

export const SearchInput = styled(InputBase)`
  padding: 0 0.5rem;
  font-size: ${theme.font.size.normal};
  background: none;
  border: none;
  box-sizing: border-box;
  height: 100%;
  flex: 1;
  color: ${theme.palette.font.primary};

  ::-webkit-input-placeholder {
    color: ${theme.palette.font.primary};
  }
`;

export const Brand = styled.div`
  font-size: ${theme.font.size.large};
  margin: 0 1.5rem;
`;

export const DropMenuEl = styled.div`
  height: 100%;
  width: 100%;
`;

export const SignInMenuEl = styled(DropMenuEl)`
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const DropdownMenuContainer = styled.div`
  position: absolute;
  background: ${theme.palette.bg.primary};
  top: 46px;
  right: 9px;
  z-index: 401;
  width: 310px;
  height: 260px;
`;

export const DropdownMenuButton = styled(NavHover)`
  height: 2rem;
`;

export const Points = styled.div`
  color: ${theme.palette.font.primary};
  background-color: ${theme.palette.success};
  border-radius: 0.3rem;
  padding: 0.1rem 0.3rem;
  font-size: ${theme.font.size.small};
`;

export const SignInContainer = styled.div`
  margin-left: 0;
  position: relative;
  height: 100%;
  outline: none;
`;

export const SignInEl = styled.div`
  text-decoration: none;
  color: ${theme.palette.font.primary};

  a {
    text-decoration: none;
    color: ${theme.palette.font.primary};
  }
`;

export const Hamburger = () => {
  return h(
    'svg',
    {
      height: '32px',
      style: { enableBackground: 'new 0 0 32 32' },
      viewBox: '0 0 32 32',
      fill: theme.palette.font.primary,
      width: '32px',
      xmlSpace: 'preserve',
      xmlns: 'http://www.w3.org/2000/svg',
      xmlnsXlink: 'http://www.w3.org/1999/xlink',
    },
    [
      h('path', {
        d:
          'M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2  s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2  S29.104,22,28,22z',
      }),
    ],
  );
};
