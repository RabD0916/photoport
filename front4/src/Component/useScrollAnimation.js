import { useRef, useState, useEffect } from "react";

const useScrollAnimation = () => {
    const [isInViewport, setIsInViewport] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if (!ref.current) return; // 요소가 아직 준비되지 않은 경우 중단

        const callback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // 요소가 뷰포트에 나타났을 경우
                    setIsInViewport(true);
                } else {
                }
            });
        };

        const options = { root: null, rootMargin: "0px", threshold: 0 };

        const observer = new IntersectionObserver(callback, options);
        observer.observe(ref.current); // 요소 관찰 시작

        return () => {
            observer.disconnect(); // 컴포넌트 언마운트 시 관찰 중단
        };
    }, []);

    return { isInViewport, ref };
};

export { useScrollAnimation };
