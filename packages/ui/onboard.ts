import * as h from 'react-hyperscript';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 314159;
`;
const Modal = styled.div`
  width: 300px;
  height: 300px;
  background-color: #fff;
`;

export default () => h(Overlay, [h(Modal, [h('div', 'hi there')])]);
