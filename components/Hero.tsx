"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.23, 1, 0.32, 1] as const },
});

const COMPANIES: { name: string; logo: string }[] = [
  { name: "Razorpay", logo: "/homepage/Razorpay.png" },
  { name: "PayU",     logo: "/homepage/PayU.png"     },
  { name: "ADP",      logo: "/homepage/ADP.png"      },
];

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const typedRef = useRef<HTMLSpanElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 750], [1, 0.86]);
  const borderRadius = useTransform(scrollY, [0, 750], [0, 24]);
  const innerOpacity = useTransform(scrollY, [300, 750], [1, 0.62]);

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pts = Array.from({ length: 100 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0002,
      vy: (Math.random() - 0.5) * 0.0002,
      r: Math.random() * 1.1 + 0.4,
    }));

    let animId: number;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function draw() {
      if (!canvas || !ctx) return;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      for (let a = 0; a < pts.length; a++) {
        for (let b = a + 1; b < pts.length; b++) {
          const dx = (pts[a].x - pts[b].x) * W;
          const dy = (pts[a].y - pts[b].y) * H;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 90) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(139,92,246,${0.2 * (1 - d / 90)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(pts[a].x * W, pts[a].y * H);
            ctx.lineTo(pts[b].x * W, pts[b].y * H);
            ctx.stroke();
          }
        }
      }

      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(196,181,253,0.5)";
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;
      }
      animId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Typed text
  useEffect(() => {
    const phrases = [
      "Product Design",
      "UX Strategy",
      "Systems Thinking",
      "Research & Synthesis",
      "Front-end Development",
      "Product Thinking",
    ];
    let pi = 0, ci = 0, del = false, wait = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    function step() {
      const el = typedRef.current;
      if (!el) return;
      const p = phrases[pi];
      if (wait > 0) {
        wait--;
        timeoutId = setTimeout(step, 60);
        return;
      }
      if (!del) {
        el.textContent = p.slice(0, ci + 1);
        ci++;
        if (ci === p.length) {
          del = true;
          wait = 26;
          timeoutId = setTimeout(step, 60);
        } else {
          timeoutId = setTimeout(step, 65 + Math.random() * 45);
        }
      } else {
        el.textContent = p.slice(0, ci - 1);
        ci--;
        if (ci === 0) {
          del = false;
          pi = (pi + 1) % phrases.length;
          timeoutId = setTimeout(step, 300);
        } else {
          timeoutId = setTimeout(step, 32);
        }
      }
    }
    timeoutId = setTimeout(step, 900);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <section id="home" ref={sectionRef}>
      <motion.div
        className="hero-card"
        style={{ scale, borderRadius, opacity: innerOpacity }}
      >
        <div className="blob-a" />
        <div className="blob-b" />
        <div className="blob-c" />
        <canvas id="particle-canvas" ref={canvasRef} />
        <div className="hero-grid" />

        <motion.div className="hero-name" {...fadeUp(0.15)}>
          I&apos;m Jitender
        </motion.div>

        <motion.div className="hero-eyebrow" {...fadeUp(0.28)}>
          Senior Product Designer &middot; Razorpay &middot; Bengaluru
        </motion.div>

        <motion.div className="hero-role" {...fadeUp(0.4)}>
          // <span className="typed-text" ref={typedRef} />
          <span className="typed-cursor" />
        </motion.div>

        <motion.p className="hero-intro" {...fadeUp(0.52)}>
          I design products that work — from the first research conversation to the
          shipped interface. <strong>Research, product thinking, design, and code</strong> — the full loop.
        </motion.p>

        <motion.div className="logos-strip" {...fadeUp(0.65)}>
          <div className="logos-strip-label">Companies I&apos;ve worked with</div>
          <div className="logos-row">
            {COMPANIES.map(({ name, logo }, i) => (
              <div key={i} className="logo-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo} alt={name} className="logo-img" />
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
