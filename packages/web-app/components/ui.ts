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

export const HoodListItem = styled.div`
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 5px;
  flex: 1;

  :hover {
    background-color: rgba(46, 139, 87, 0.5);
  }
`;

export const HoodListItemSelected = styled.div`
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 5px;
  flex: 1;
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
