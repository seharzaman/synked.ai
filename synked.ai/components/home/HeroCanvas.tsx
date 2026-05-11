"use client";

import { useEffect, useRef } from "react";

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    const mouse = { x: -999, y: -999 };

    function resize() {
      W = canvas!.width = window.innerWidth;
      H = canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    document.addEventListener("mousemove", onMouseMove);

    // Exact particle class from old site
    class P {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;

      constructor() {
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.size = 0;
        this.alpha = 0;
        this.color = "";
        this.reset(true);
      }

      reset(init: boolean) {
        this.x = Math.random() * W;
        this.y = init ? Math.random() * H : H + 10;
        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = -(Math.random() * 0.4 + 0.1);
        this.size = Math.random() * 2.8 + 1;
        this.alpha = Math.random() * 0.55 + 0.25;
        const r = Math.random();
        this.color =
          r > 0.66 ? "18,88,66" : r > 0.33 ? "127,140,67" : "176,137,170";
      }

      update() {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 14400) {
          // 120² — skip sqrt when far away
          const d = Math.sqrt(d2);
          const f = ((120 - d) / 120) * 0.6;
          this.vx += (dx / d) * f * 0.05;
          this.vy += (dy / d) * f * 0.05;
        }
        this.vx *= 0.99;
        this.vy *= 0.99;
        this.x += this.vx;
        this.y += this.vy;
        if (this.y < -10 || this.x < -20 || this.x > W + 20) this.reset(false);
      }

      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${this.color},${this.alpha})`;
        ctx!.fill();
      }
    }

    const particles: P[] = [];
    // Scale particle count by screen area — 110 at 1440×900, fewer on mobile
    const baseArea = 1440 * 900;
    const screenArea = W * H;
    const count = Math.max(
      25,
      Math.min(110, Math.round(110 * (screenArea / baseArea))),
    );
    // Scale connection distance too — tighter on small screens
    const connDist = W < 600 ? 100 : 140;
    const connDist2 = connDist * connDist;
    for (let i = 0; i < count; i++) particles.push(new P());

    function drawLines() {
      const len = particles.length;
      for (let i = 0; i < len; i++) {
        const pi = particles[i];
        for (let j = i + 1; j < len; j++) {
          const pj = particles[j];
          const dx = pi.x - pj.x;
          if (dx > connDist || dx < -connDist) continue;
          const dy = pi.y - pj.y;
          if (dy > connDist || dy < -connDist) continue;
          const d2 = dx * dx + dy * dy;
          if (d2 < connDist2) {
            const d = Math.sqrt(d2);
            ctx!.beginPath();
            ctx!.moveTo(pi.x, pi.y);
            ctx!.lineTo(pj.x, pj.y);
            ctx!.strokeStyle = `rgba(18,88,66,${(1 - d / connDist) * 0.22})`;
            ctx!.lineWidth = 0.8;
            ctx!.stroke();
          }
        }
      }
    }

    let raf: number;
    function loop() {
      ctx!.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      drawLines();
      raf = requestAnimationFrame(loop);
    }
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen pointer-events-auto z-0"
    />
  );
}
