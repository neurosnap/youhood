import styled from 'styled-components';

export const Overlay = styled.div`
  margin: 20px 0;
  border-radius: 15px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export const HoodContainer = Overlay.extend`
  height: 20%;
  padding: 10px;
`;

export const OverlayHoodContainer = styled.div`
  display: flex;
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

export const HoodSelectionContainer = Overlay.extend`
  height: 20%;
`;

export const HoodListItem = styled.div`
  cursor: pointer;
  font-size: 11px;

  :hover {
    background-color: green;
  }
`;
