"use client";

import { useEffect } from "react";

export function useCursorGlow() {
  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth <= 1024) return;

    const glow = document.createElement("div");
    Object.assign(glow.style, {
      position: "fixed",
      width: "500px",
      height: "500px",
      borderRadius: "50%",
      pointerEvents: "none",
      zIndex: "0",
      background:
        "radial-gradient(circle, rgba(18,88,66,0.055) 0%, transparent 65%)",
      transform: "translate(-50%, -50%)",
    });
    document.body.appendChild(glow);

    let tx = 0,
      ty = 0,
      gx = 0,
      gy = 0;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const animate = () => {
      gx += (tx - gx) * 0.07;
      gy += (ty - gy) * 0.07;
      glow.style.left = `${gx}px`;
      glow.style.top = `${gy}px`;
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      glow.remove();
    };
  }, []);
}
