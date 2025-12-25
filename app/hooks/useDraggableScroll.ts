import { useRef, useState, MouseEvent, useCallback } from 'react';

export function useDraggableScroll() {
    const ref = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const onMouseDown = useCallback((e: MouseEvent) => {
        if (!ref.current) return;
        setIsDragging(true);
        setStartX(e.pageX - ref.current.offsetLeft);
        setScrollLeft(ref.current.scrollLeft);
        
        // Visual feedback and disable snap during drag
        ref.current.style.cursor = 'grabbing';
        ref.current.style.userSelect = 'none';
        ref.current.style.scrollSnapType = 'none';
    }, []);

    const onMouseLeave = useCallback(() => {
        if (!isDragging) return;
        setIsDragging(false);
        if (ref.current) {
             ref.current.style.cursor = 'grab';
             ref.current.style.removeProperty('user-select');
             ref.current.style.removeProperty('scroll-snap-type'); // Restore snap
        }
    }, [isDragging]);

    const onMouseUp = useCallback(() => {
        setIsDragging(false);
        if (ref.current) {
             ref.current.style.cursor = 'grab';
             ref.current.style.removeProperty('user-select');
             ref.current.style.removeProperty('scroll-snap-type'); // Restore snap
        }
    }, []);

    const onMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging || !ref.current) return;
        e.preventDefault();
        const x = e.pageX - ref.current.offsetLeft;
        const walk = (x - startX) * 1.5; // Scroll speed multiplier
        ref.current.scrollLeft = scrollLeft - walk;
    }, [isDragging, startX, scrollLeft]);

    return { 
        ref, 
        events: { 
            onMouseDown, 
            onMouseLeave, 
            onMouseUp, 
            onMouseMove 
        },
        isDragging
    };
}