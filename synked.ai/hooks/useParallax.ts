"use client";

import { useEffect, useRef } from "react";

export function useParallax(speeds = [0.25, 0.12, 0.18]) {
  const refs = useRef<(HTMLElement | null)[]>([]);

  const setRef = (index: number) => (el: HTMLElement | null) => {
    refs.current[index] = el;
  };

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      refs.current.forEach((el, i) => {
        if (!el) return;
        const speed = speeds[i % speeds.length];
        el.style.transform = `translateY(${y * speed}px)`;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speeds]);

  return setRef;
}
