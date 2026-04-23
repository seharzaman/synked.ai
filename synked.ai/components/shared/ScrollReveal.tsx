"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right";
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const directionStyles = {
    up: "translate-y-[30px]",
    left: "-translate-x-[40px]",
    right: "translate-x-[40px]",
  };

  return (
    <div
      ref={ref}
      className={`opacity-0 ${directionStyles[direction]} transition-all duration-700 ease-[var(--ease)] [&.revealed]:opacity-100 [&.revealed]:translate-x-0 [&.revealed]:translate-y-0 ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}
