import styled from 'styled-components';

const successColor = '#28a745';
const errorColor = '#dc3545';
const primaryFontColor = '#fff';

// core

export const Header = styled.h1`
  font-size: 1.3rem;
`;

export const HeaderSmall = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

export const Link = styled.a`
  margin: 0 0.2rem;
  color: ${primaryFontColor};
`;

export const LinkDanger = Link.extend`
  color: ${errorColor};
`;

export const LinkSuccess = Link.extend`
  color: ${successColor};
`;

export const InputBase = styled.input`
  margin: 0;
  outline: none;
`;

export const TextSmall = styled.div`
  font-size: 0.8rem;
  display: flex;
  justify-content: space-between;
`;

// derived

export const InputOverlay = InputBase.extend`
  padding: 0.375rem 0.75rem;
  color: #495057;
  background-color: #fff;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  width: 100%;
`;

const OverlaySection = styled.div`
  background-color: #fff;
  border-radius: 0.3rem;
  padding: 0.6rem;
`;

export const HoodContainer = OverlaySection.extend`
  display: flex;
`;
export const HoodEditorContainer = OverlaySection;

export const HoodSelectionContainer = OverlaySection.extend`
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5rem;
`;

export const HoodSelectionItem = styled.div`
  display: flex;
  align-items: center;
`;

export const HoodVisibility = styled.i`
  cursor: pointer;
`;

export const Votes = styled.div`
  padding: 0 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const VoteUp = styled.i`
  cursor: pointer;
`;

export const Voted = VoteUp.extend`
  color: orange;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const EditorActions = Actions.extend`
  margin-top: 0.5rem;
`;

export const HoodBaseItem = styled.div`
  cursor: pointer;
  padding: 0.3rem 0.4rem;
  border-radius: 0.3rem;
  flex: 1;
  margin-left: 0.3rem;
`;

export const HoodListItem = HoodBaseItem.extend`
  :hover {
    background-color: rgba(46, 139, 87, 0.5);
  }
`;

export const HoodListItemSelected = HoodBaseItem.extend`
  background-color: rgb(255, 250, 205);
`;

export const OverlayHeader = styled.div`
  font-size: 1rem;
  color: ${primaryFontColor};
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
    background-color: rgba(255, 255, 255, 0.25);
  }

  :disabled {
    color: #ccc;
  }
`;

export const HoodBarButton = NavHover.extend`
  font-size: 0.8rem;
`;

export const Input = InputBase.extend`
  margin: 0.4rem;
  padding: 0.4rem;
  border-radius: 0.1rem;
  height: 3rem;
  border: none;
  background-image: none;
  background-color: rgba(255, 255, 255, 0.15);
  box-shadow: none;
  width: 90%;
  color: ${primaryFontColor};
  font-size: 1rem;

  :hover {
    background-color: rgba(255, 255, 255, 0.25);
  }

  ::-webkit-input-placeholder {
    color: #eee;
  }
`;

export const SigninMsgBase = styled.div`
  height: 2rem;
`;

export const ErrorText = SigninMsgBase.extend`
  color: #721c24;
  background-color: #f8d7da;
  font-size: 0.8rem;
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

export const Menu = NavHover.extend`
  height: 2rem;
`;

export const Nav = styled.div`
  display: flex;
  align-items: center;
  height: 56px;
  background: #4285f4;
  box-sizing: border-box;
  top: 0;
  width: 100vw;
  color: ${primaryFontColor};
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
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 0.1rem;
  display: flex;
  align-items: center;

  :hover {
    background-color: rgba(255, 255, 255, 0.25);
  }
`;

export const SearchInput = InputBase.extend`
  font-size: 1rem;
  background: none;
  border: none;
  box-sizing: border-box;
  height: 100%;
  flex: 1;
  color: ${primaryFontColor};

  ::-webkit-input-placeholder {
    color: ${primaryFontColor};
  }
`;

export const SearchIcon = styled.i`
  margin: 0 0.5rem;
`;

export const Brand = styled.div`
  font-size: 1.1rem;
  margin: 0 1.5rem;
`;

export const SignInMenuEl = styled.div`
  height: 80%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const DropdownMenuContainer = styled.div`
  position: absolute;
  background: #4285f4;
  top: 46px;
  right: 9px;
  z-index: 401;
  width: 310px;
  height: 260px;
`;

export const DropdownMenuButton = NavHover.extend`
  height: 2rem;
`;

export const Points = styled.div`
  color: ${primaryFontColor};
  background-color: limegreen;
  border-radius: 0.3rem;
  padding: 0.1rem 0.3rem;
  font-size: 0.8rem;
`;

export const SignInContainer = styled.div`
  margin-left: 0;
  position: relative;
  height: 100%;
`;

export const SignInEl = styled.div`
  text-decoration: none;
  color: ${primaryFontColor};

  a {
    text-decoration: none;
    color: ${primaryFontColor};
  }
`;
