import { useEffect, useState } from 'react';

const useTouchSlide = ({ ref = window, onSlideLeft, onSlideRight }) => {
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    useEffect(() => {
        const handleTouchStart = (e) => {
            e.preventDefault();
            setTouchEnd(0)
            setTouchStart(e.targetTouches[0].clientX);
        };

        const handleTouchMove = (e) => {
            e.preventDefault();
            setTouchEnd(e.targetTouches[0].clientX);
        };

        const handleTouchEnd = (e) => {
            e.preventDefault();
            if (touchStart === 0 || touchEnd === 0) return;
            if (touchStart - touchEnd > 100) {
                setTouchStart(0)
                setTouchEnd(0)
                onSlideRight();
            }

            if (touchStart - touchEnd < -100) {
                setTouchStart(0)
                setTouchEnd(0)
                onSlideLeft();
            }
        };

        const element = ref.current;
        const isSupported = element && element.addEventListener;
        if (isSupported) {
            element.addEventListener("touchstart", handleTouchStart);
            element.addEventListener("touchmove", handleTouchMove);
            element.addEventListener("touchend", handleTouchEnd);
        }

        return () => {
            if (isSupported) {
                element.removeEventListener("touchstart", handleTouchStart);
                element.removeEventListener("touchmove", handleTouchMove);
                element.removeEventListener("touchend", handleTouchEnd);
            }
        };
    }, [ref, onSlideLeft, onSlideRight, touchEnd, touchStart])

    return null;
}

export default useTouchSlide;