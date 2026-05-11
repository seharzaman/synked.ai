
import { useEffect, useRef } from "react";

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  staggerDelay?: number;
}

export function useScrollReveal<T extends HTMLElement>(
  options: ScrollRevealOptions = {},
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const { threshold = 0.1, rootMargin = "0px 0px -50px 0px" } = options;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin },
    );

    // Observe the element itself or its children with [data-scroll-reveal]
    const children = el.querySelectorAll("[data-scroll-reveal]");
    if (children.length > 0) {
      children.forEach((child, i) => {
        const stagger = options.staggerDelay ?? 0.12;
        (child as HTMLElement).style.transitionDelay = `${i * stagger}s`;
        observer.observe(child);
      });
    } else {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [options]);

  return ref;
}
