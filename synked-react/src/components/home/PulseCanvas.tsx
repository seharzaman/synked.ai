import { useEffect, useRef } from "react";

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  decay: number;
  r: number;
  col: string;
}

function createSpark(x: number, y: number): Spark {
  const a = Math.random() * Math.PI - Math.PI / 2 + (Math.random() - 0.5) * 1.2;
  const s = Math.random() * 2.5 + 0.8;
  return {
    x,
    y,
    vx: Math.cos(a) * s,
    vy: Math.sin(a) * s,
    life: 1,
    decay: Math.random() * 0.04 + 0.025,
    r: Math.random() * 2 + 0.8,
    col: Math.random() > 0.5 ? "127,140,67" : "18,88,66",
  };
}

export function PulseCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0,
      H = 160;
    let dpr = 1;
    const sparks: Spark[] = [];
    let pX = -60,
      t = 0;
    let nxp: number[] = [];
    const lit = new Set<number>();

    const WL = [
      { amp: 28, freq: 0.015, ph: 0, col: "18,88,66", a: 1, lw: 2.2 },
      { amp: 16, freq: 0.028, ph: 0.8, col: "127,140,67", a: 0.6, lw: 1.4 },
      { amp: 10, freq: 0.048, ph: 1.9, col: "176,137,170", a: 0.3, lw: 0.8 },
      { amp: 6, freq: 0.072, ph: 3.1, col: "127,140,67", a: 0.18, lw: 0.5 },
    ];

    function resize() {
      dpr = window.devicePixelRatio || 1;
      W = canvas!.offsetWidth;
      H = 160;
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function computeNX() {
      const wr = canvas!.getBoundingClientRect();
      const nodes = document.querySelectorAll("[data-pulse-node]");
      nxp = [];
      nodes.forEach((n) => {
        const r = n.getBoundingClientRect();
        nxp.push(r.left - wr.left + r.width / 2);
      });
    }

    function drawWave(w: (typeof WL)[0], prog: number) {
      const cy = H / 2;
      ctx!.beginPath();
      for (let x = 0; x <= W; x += 1.5) {
        const rel = prog - x / W;
        let env = 0;
        if (rel > 0 && rel < 0.65) {
          env = rel < 0.1 ? rel / 0.1 : 1 - (rel - 0.1) / 0.55;
          env = Math.max(0, Math.pow(env, 0.7));
        }
        const y = cy + Math.sin(x * w.freq + w.ph + t * 0.035) * w.amp * env;
        x === 0 ? ctx!.moveTo(x, y) : ctx!.lineTo(x, y);
      }
      ctx!.strokeStyle = `rgba(${w.col},${w.a})`;
      ctx!.lineWidth = w.lw;
      ctx!.globalAlpha = 1;
      ctx!.stroke();
    }

    function drawHead(px: number) {
      if (px < 0 || px > W + 20) return;
      const cy = H / 2;

      // Outer glow ellipse
      const g1 = ctx!.createRadialGradient(px, cy, 0, px, cy, 72);
      g1.addColorStop(0, "rgba(127,140,67,0.38)");
      g1.addColorStop(0.3, "rgba(18,88,66,0.18)");
      g1.addColorStop(1, "rgba(18,88,66,0)");
      ctx!.beginPath();
      ctx!.ellipse(px, cy, 72, H * 0.55, 0, 0, Math.PI * 2);
      ctx!.fillStyle = g1;
      ctx!.fill();

      // Mid glow
      const g2 = ctx!.createRadialGradient(px, cy, 0, px, cy, 14);
      g2.addColorStop(0, "rgba(200,220,120,0.95)");
      g2.addColorStop(0.5, "rgba(127,140,67,0.8)");
      g2.addColorStop(1, "rgba(18,88,66,0)");
      ctx!.beginPath();
      ctx!.arc(px, cy, 14, 0, Math.PI * 2);
      ctx!.fillStyle = g2;
      ctx!.fill();

      // Core dot
      ctx!.beginPath();
      ctx!.arc(px, cy, 3.5, 0, Math.PI * 2);
      ctx!.fillStyle = "#C8DC78";
      ctx!.fill();

      // Tail gradient line
      const tail = ctx!.createLinearGradient(Math.max(0, px - 90), cy, px, cy);
      tail.addColorStop(0, "rgba(127,140,67,0)");
      tail.addColorStop(0.6, "rgba(18,88,66,0.3)");
      tail.addColorStop(1, "rgba(200,220,120,0.7)");
      ctx!.beginPath();
      ctx!.moveTo(Math.max(0, px - 90), cy);
      ctx!.lineTo(px, cy);
      ctx!.strokeStyle = tail;
      ctx!.lineWidth = 2;
      ctx!.stroke();

      // Emit sparks
      if (Math.random() < 0.35 && px > 0 && px < W) {
        sparks.push(createSpark(px, cy));
      }
    }

    function lightNodes(px: number) {
      computeNX();
      const nodes = document.querySelectorAll("[data-pulse-node]");
      nodes.forEach((node, i) => {
        const nx = nxp[i];
        if (nx === undefined) return;
        const dist = Math.abs(px - nx);
        if (dist < 52 && !lit.has(i)) {
          node.classList.add("lit");
          lit.add(i);
          (node as HTMLElement).style.transition =
            "all 0.2s cubic-bezier(0.16,1,0.3,1)";
          setTimeout(() => {
            (node as HTMLElement).style.transition = "";
          }, 300);
        } else if (dist > 180 && lit.has(i) && px > nx + 180) {
          const idx = i;
          setTimeout(() => {
            node.classList.remove("lit");
            lit.delete(idx);
          }, 600);
        }
      });
    }

    function frame() {
      ctx!.clearRect(0, 0, W, H);

      // Grid lines
      ctx!.strokeStyle = "rgba(235,220,200,0.04)";
      ctx!.lineWidth = 0.5;
      for (let y = 20; y < H; y += 20) {
        ctx!.beginPath();
        ctx!.moveTo(0, y);
        ctx!.lineTo(W, y);
        ctx!.stroke();
      }
      // Center line
      ctx!.beginPath();
      ctx!.moveTo(0, H / 2);
      ctx!.lineTo(W, H / 2);
      ctx!.strokeStyle = "rgba(235,220,200,0.1)";
      ctx!.lineWidth = 0.5;
      ctx!.stroke();

      // Waves
      const prog = pX / W;
      WL.forEach((w) => drawWave(w, prog));

      // Head
      drawHead(pX);

      // Sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.04;
        s.life -= s.decay;
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.r * (0.4 + s.life * 0.6), 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${s.col},${s.life * 0.85})`;
        ctx!.fill();
        if (s.life <= 0) sparks.splice(i, 1);
      }

      // Light nodes
      lightNodes(pX);

      // Advance head
      pX += 2.4;
      t++;
      if (pX > W + 100) {
        pX = -60;
        lit.clear();
        document
          .querySelectorAll("[data-pulse-node]")
          .forEach((n) => n.classList.remove("lit"));
      }

      rafId = requestAnimationFrame(frame);
    }

    resize();
    let rafId: number;
    let running = false;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !running) {
            running = true;
            computeNX();
            rafId = requestAnimationFrame(frame);
          }
        });
      },
      { threshold: 0.15 },
    );
    obs.observe(canvas);

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(rafId);
      obs.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        display: "block",
        borderRadius: 3,
      }}
      height={160}
    />
  );
}
