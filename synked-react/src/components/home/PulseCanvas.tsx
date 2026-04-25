import { useEffect, useRef } from "react";

export function PulseCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let w = 0,
      h = 0;
    let t = 0;
    let visible = true;

    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      t += 0.015;

      const mid = h / 2;
      const waves = [
        {
          amp: 30,
          freq: 0.02,
          speed: 1,
          color: "rgba(18,88,66,0.3)",
          width: 2,
        },
        {
          amp: 20,
          freq: 0.03,
          speed: 1.5,
          color: "rgba(127,140,67,0.25)",
          width: 1.5,
        },
        {
          amp: 15,
          freq: 0.04,
          speed: 2,
          color: "rgba(176,137,170,0.2)",
          width: 1,
        },
        {
          amp: 25,
          freq: 0.025,
          speed: 0.8,
          color: "rgba(235,220,200,0.15)",
          width: 1,
        },
      ];

      waves.forEach((wave) => {
        ctx.beginPath();
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = wave.width;

        for (let x = 0; x < w; x++) {
          const y =
            mid +
            Math.sin(x * wave.freq + t * wave.speed) * wave.amp +
            Math.sin(x * wave.freq * 2 + t * wave.speed * 0.7) *
              (wave.amp * 0.3);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Traveling dot
        const dotX = (t * wave.speed * 40) % w;
        const dotY =
          mid +
          Math.sin(dotX * wave.freq + t * wave.speed) * wave.amp +
          Math.sin(dotX * wave.freq * 2 + t * wave.speed * 0.7) *
            (wave.amp * 0.3);

        ctx.beginPath();
        ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
        ctx.fillStyle = wave.color.replace(/[\d.]+\)$/, "0.8)");
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(dotX, dotY, 8, 0, Math.PI * 2);
        ctx.fillStyle = wave.color.replace(/[\d.]+\)$/, "0.2)");
        ctx.fill();
      });

      if (visible) raf = requestAnimationFrame(draw);
    };

    resize();

    // Only run animation when canvas is visible
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          raf = requestAnimationFrame(draw);
        } else {
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
