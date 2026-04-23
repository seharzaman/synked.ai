"use client";

import { useCallback, useRef } from "react";

export function useMagnetic(strength = { x: 0.18, y: 0.22 }) {
  const ref = useRef<HTMLElement>(null);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * strength.x;
      const y = (e.clientY - rect.top - rect.height / 2) * strength.y;
      el.style.transform = `translate(${x}px, ${y}px)`;
    },
    [strength.x, strength.y],
  );

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)";
    el.style.transform = "";
    const cleanup = () => {
      el.style.transition = "";
    };
    el.addEventListener("transitionend", cleanup, { once: true });
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}
