"use client";

import { useCallback, useRef } from "react";

export function useTilt(maxDeg = 6, translateZ = 8) {
  const ref = useRef<HTMLElement>(null);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(600px) rotateY(${x * maxDeg}deg) rotateX(${-y * maxDeg}deg) translateZ(${translateZ}px)`;
    },
    [maxDeg, translateZ],
  );

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)";
    el.style.transform = "";
    el.addEventListener(
      "transitionend",
      () => {
        el.style.transition = "";
      },
      { once: true },
    );
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}
