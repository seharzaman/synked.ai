"use client";

import { useEffect, useRef, useState } from "react";

export function useCountUp(
  target: number,
  duration = 1800,
  options?: { prefix?: string; suffix?: string; decimals?: number },
) {
  const [value, setValue] = useState("0");
  const ref = useRef<HTMLElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const start = performance.now();
          const decimals = options?.decimals ?? (target % 1 !== 0 ? 1 : 0);

          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * target;
            const formatted =
              decimals > 0
                ? current.toFixed(decimals)
                : String(Math.round(current));
            setValue(
              `${options?.prefix ?? ""}${formatted}${options?.suffix ?? ""}`,
            );
            if (progress < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration, options]);

  return { ref, value };
}
