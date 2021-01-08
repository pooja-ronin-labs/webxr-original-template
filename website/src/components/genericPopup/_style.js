import styled, { keyframes } from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  width:100vw;
  height: 100vh;
  height: calc(var(--vh, 1vh)*100);
  background: rgba(0 ,0, 0, 1);
  top: 0;
  opacity: 0;
  z-index:1;
  transition: opacity .5s linear;
  &.show {
    opacity: 1;
    transition: opacity .5s linear;
  }
`;
const slideIn = keyframes`
   from {opacity: 0;transform: translateY(-70%);}
  to {opacity: 1;transform: translateY(-50%);}
`
export const ModalContent = styled.div`
  width: 90%;
  max-width: 480px;
  max-height: 90%;
  position: absolute;
  background: #fff;
  padding: 20px;
  z-index:2;
  margin:auto;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-70%);
  opacity:0;
  display: flex;
  flex-direction: column;
  transition: all .5s linear;
  &.slideIn {
    opacity: 1;
    animation: ${slideIn} 1s;
    transform: translateY(-50%);
  }

  & .title {
    width: 70%;
    font-size: 36px;
    background-image: linear-gradient(to right, #23718c, #00b2d2);
    letter-spacing: 0.6px;
    line-height: 1.13;
    font-weight: normal;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0 0 15px;
  }
  & .content {
    flex-grow: 1;
    position: relative;
    overflow: auto;
    color: #000;
    &:before {
      content: '';
      height: 20px;
      left: 0;
      right: 0;
      top: -1px;
      position: sticky;
      display: block;
      background: linear-gradient(to bottom, white, transparent);
    }
    &:after {
      content: '';
      height: 20px;
      left: 0;
      right: 0;
      bottom: -2px;
      position: sticky;
      display: block;
      background: linear-gradient(to top, white, transparent);
    }
  }
`

export const CloseButton = styled.button`
  width: 280px;
  border: none;
  background: #000;
  color: #00b2d2;
  margin: 40px auto 0;
  padding: 15px 0
`