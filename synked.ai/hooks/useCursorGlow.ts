import { useEffect } from "react";

export function useCursorGlow() {
  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth <= 1024) return;

    const glow = document.createElement("div");
    Object.assign(glow.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "340px",
      height: "340px",
      borderRadius: "50%",
      pointerEvents: "none",
      zIndex: "1",
      background:
        "radial-gradient(circle, rgba(127,140,67,.13) 0%, rgba(18,88,66,.07) 40%, transparent 70%)",
      willChange: "transform",
    });
    document.body.appendChild(glow);

    let tx = window.innerWidth / 2,
      ty = window.innerHeight / 2,
      gx = tx,
      gy = ty;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const animate = () => {
      gx += (tx - gx) * 0.12;
      gy += (ty - gy) * 0.12;
      glow.style.transform = `translate(${gx - 170}px, ${gy - 170}px)`;
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
