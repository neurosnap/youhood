import styled from 'styled-components';

const OverlaySection = styled.div`
  display: flex;
  background-color: #fff;
  border-radius: 5px;
  padding: 15px;
`;

export const HoodContainer = OverlaySection;

export const HoodSelectionContainer = OverlaySection.extend`
  flex-direction: column;
  margin-bottom: 20px;
`;

export const HoodSelectionItem = styled.div`
  display: flex;
  align-items: center;
`;

export const HoodVisibility = styled.i`
  cursor: pointer;
`;

export const Votes = styled.div`
  margin-right: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  width: 50%;
  padding: 10px;
`;

export const HoodBaseItem = styled.div`
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 5px;
  flex: 1;
  margin-left: 5px;
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
  font-size: 16px;
  color: #fff;
`;

export const OverlayContainer = styled.div`
  width: 90%;
  margin-top: 15px;
`;

export const NavHover = styled.div`
  cursor: pointer;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 10px;
  margin: 0 10px;

  :hover {
    background-color: rgba(255, 255, 255, 0.25);
  }
`;

export const InputBase = styled.input`
  margin: 0;
  outline: none;
`;

export const Input = InputBase.extend`
  margin: 10px;
  padding: 10px;
  border-radius: 2px;
  height: 50px;
  border: none;
  background-image: none;
  background-color: rgba(255, 255, 255, 0.15);
  box-shadow: none;
  width: 90%;
  color: #fff;
  font-size: 16px;

  :hover {
    background-color: rgba(255, 255, 255, 0.25);
  }

  ::-webkit-input-placeholder {
    color: #eee;
  }
`;

export const SigninMsgBase = styled.div`
  height: 30px;
`;

export const ErrorText = SigninMsgBase.extend`
  color: #721c24;
  background-color: #f8d7da;
  font-size: 11px;
  padding: 0 15px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Buttons = styled.div`
  margin-top: 10px;
  display: flex;
`;

export const Menu = NavHover.extend`
  height: 36px;
`;

export const Nav = styled.div`
  display: flex;
  align-items: center;
  height: 56px;
  background: #4285f4;
  box-sizing: border-box;
  top: 0;
  width: 100vw;
  color: #fff;
`;

export const NavContent = styled.div`
  width: 100%;
  margin: 0 24px;
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
  height: 36px;
  width: 75%;
`;

export const Search = styled.div`
  width: 40%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  display: flex;
  align-items: center;

  :hover {
    background-color: rgba(255, 255, 255, 0.25);
  }
`;

export const SearchInput = InputBase.extend`
  font-size: 15px;
  background: none;
  border: none;
  box-sizing: border-box;
  height: 100%;
  flex: 1;
  color: #fff;

  ::-webkit-input-placeholder {
    color: #fff;
  }
`;

export const SearchIcon = styled.i`
  margin: 0 10px;
`;

export const Brand = styled.div`
  font-size: 20px;
  margin: 0 24px;
`;

export const SignInMenuEl = styled.div`
  height: 100%;
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
  width: 300px;
  height: 230px;
`;

export const DropdownMenuButton = NavHover.extend`
  height: 36px;
`;
