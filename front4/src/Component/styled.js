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
  &.frame-in {
    animation: ${frameInAnimation} 2s forwards;
  }
  flex: 1;
`;
