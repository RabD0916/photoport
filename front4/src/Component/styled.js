import styled, { keyframes } from "styled-components";

const frameInAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-100%);
  }

  100%{
    opacity: 1;
    transform: translateX(0%);
  }

`;

export const Container = styled.div`
  @media (max-width: 599px) {
    font-size: 5px;
  }
  @media (min-width: 600px) {
    &.frame-in {
      animation: ${frameInAnimation} 2s;
      font-size: 50px;
    }
  }
  flex: 1;
  margin: auto;
`;
