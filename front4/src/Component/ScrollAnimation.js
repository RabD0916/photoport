import { Container } from "./styled";
import { useScrollAnimation } from "./useScrollAnimation";
import React from "react";

const ScrollAnimation = ({ children }) => {
    const { ref, isInViewport } = useScrollAnimation();
    return (
        React.createElement(Container, { ref: ref, className: isInViewport ? "frame-in" : "" }, children)
    );
};

export { ScrollAnimation };
