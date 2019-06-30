import * as React from 'react';
import styled from 'styled-components';

import theme from '@youhood/theme';
import { SFC } from 'react';

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

export const Button = styled.button`
  min-width: 185px;
  white-space: nowrap;
  display: inline-block;
  height: 40px;
  line-height: 40px;
  padding: 0 14px;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  font-size: ${theme.font.size.normal};
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  text-decoration: none;
  transition: all 0.15s ease;
  color: #fff;
  background: #3ecf8e;
  text-align: center;
  cursor: pointer;

  :hover {
    box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }

  :disabled {
    background-color: ${theme.palette.bg.accent};
    cursor: inherit;
  }
`;

export const ButtonLight = styled(Button)`
  color: #6772e5;
  background-color: #fff;

  ${theme.responsive.mobile`
    margin-top: 10px;
  `}
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
  padding: 0.4rem 0.6rem;
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

export const ErrorText = styled.div`
  margin-top: 1rem;
  color: ${theme.palette.font.error};
  background-color: ${theme.palette.bg.error};
  font-size: ${theme.font.size.small};
  padding: 1rem;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Buttons = styled.div`
  margin-top: 0.4rem;
  display: flex;
  justify-content: center;
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
  right: 7px;
  z-index: 401;
  width: 310px;
  min-height: 260px;
  padding: 1rem;
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

export const Hamburger = () => {
  return (
    <svg
      height="32px"
      style={{ enableBackground: 'new 0 0 32 32' }}
      viewBox="0 0 32 32"
      fill={`${theme.palette.font.primary}`}
      width="32px"
      xmlSpace="preserve"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <path d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2  s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2  S29.104,22,28,22z" />
    </svg>
  );
};

export const Trophy: SFC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <svg
      onClick={onClick}
      width={24}
      height={24}
      fill={`${theme.palette.font.primary}`}
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      xmlSpace="preserve"
    >
      <g>
        <path d="M466.45,49.374c-7.065-8.308-17.368-13.071-28.267-13.071H402.41v-11.19C402.41,11.266,391.143,0,377.297,0H134.705c-13.848,0-25.112,11.266-25.112,25.112v11.19H73.816c-10.899,0-21.203,4.764-28.267,13.071c-6.992,8.221-10.014,19.019-8.289,29.624c9.4,57.8,45.775,108.863,97.4,136.872c4.717,11.341,10.059,22.083,16.008,32.091c19.002,31.975,42.625,54.073,68.627,64.76c2.635,26.644-15.094,51.885-41.794,57.9c-0.057,0.013-0.097,0.033-0.153,0.046c-5.211,1.245-9.09,5.921-9.09,11.513v54.363h-21.986c-19.602,0-35.549,15.947-35.549,35.549v28.058c0,6.545,5.305,11.85,11.85,11.85H390.56c6.545,0,11.85-5.305,11.85-11.85v-28.058c0-19.602-15.947-35.549-35.549-35.549h-21.988V382.18c0-5.603-3.893-10.286-9.118-11.52c-0.049-0.012-0.096-0.028-0.145-0.04c-26.902-6.055-44.664-31.55-41.752-58.394c25.548-10.86,48.757-32.761,67.479-64.264c5.949-10.009,11.29-20.752,16.008-32.095c51.622-28.01,87.995-79.072,97.395-136.87C476.465,68.392,473.443,57.595,466.45,49.374z M60.652,75.192c-0.616-3.787,0.431-7.504,2.949-10.466c2.555-3.004,6.277-4.726,10.214-4.726h35.777v21.802c0,34.186,4.363,67.3,12.632,97.583C89.728,153.706,67.354,116.403,60.652,75.192z M366.861,460.243c6.534,0,11.85,5.316,11.85,11.85v16.208H134.422v-16.208c0-6.534,5.316-11.85,11.85-11.85H366.861z M321.173,394.03v42.513H191.96V394.03H321.173z M223.037,370.331c2.929-3.224,5.607-6.719,8.002-10.46c7.897-12.339,12.042-26.357,12.228-40.674c4.209,0.573,8.457,0.88,12.741,0.88c4.661,0,9.279-0.358,13.852-1.036c0.27,19.239,7.758,37.45,20.349,51.289H223.037z M378.709,81.803c0,58.379-13.406,113.089-37.747,154.049c-23.192,39.03-53.364,60.525-84.956,60.525c-31.597,0-61.771-21.494-84.966-60.523c-24.342-40.961-37.748-95.671-37.748-154.049V25.112c0-0.78,0.634-1.413,1.412-1.413h242.591c0.78,0,1.414,0.634,1.414,1.413V81.803z M451.348,75.192c-6.702,41.208-29.074,78.51-61.569,104.191c8.268-30.283,12.631-63.395,12.631-97.58V60.001h35.773c3.938,0,7.66,1.723,10.214,4.726C450.915,67.688,451.963,71.405,451.348,75.192z" />
      </g>
      <g>
        <path d="M327.941,121.658c-1.395-4.288-5.103-7.414-9.566-8.064l-35.758-5.196l-15.991-32.402c-1.997-4.044-6.116-6.605-10.626-6.605c-4.511,0-8.63,2.561-10.626,6.605l-15.991,32.402l-35.758,5.196c-4.464,0.648-8.172,3.775-9.566,8.065c-1.393,4.291-0.231,8.999,2.999,12.148l25.875,25.221l-6.109,35.613c-0.763,4.446,1.064,8.938,4.714,11.59c3.648,2.651,8.487,3,12.479,0.902L256,190.32l31.982,16.813c1.734,0.911,3.627,1.36,5.512,1.36c2.456,0,4.902-0.763,6.966-2.263c3.65-2.652,5.477-7.144,4.714-11.59l-6.109-35.613l25.875-25.221C328.172,130.658,329.334,125.949,327.941,121.658z M278.064,146.405c-2.793,2.722-4.068,6.644-3.408,10.489l3.102,18.09l-16.245-8.541c-1.725-0.908-3.62-1.36-5.514-1.36c-1.894,0-3.788,0.454-5.514,1.36l-16.245,8.541l3.102-18.09c0.66-3.844-0.615-7.766-3.408-10.489l-13.141-12.81l18.162-2.64c3.859-0.56,7.196-2.985,8.922-6.482l8.123-16.458l8.122,16.458c1.727,3.497,5.062,5.921,8.922,6.482l18.162,2.64L278.064,146.405z" />
      </g>
    </svg>
  );
};
