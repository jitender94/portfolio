"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

// Hero text uses CSS @keyframes heroFadeUp for guaranteed visibility.
// Framer Motion is kept only for the hero-card scroll effects (scale / borderRadius / opacity).

const COMPANIES: { name: string; logo: string }[] = [
  { name: "Razorpay", logo: "/homepage/Razorpay.png" },
  { name: "PayU",     logo: "/homepage/PayU.png"     },
  { name: "ADP",      logo: "/homepage/ADP.png"      },
];

const ROLES = ["Senior Product Designer, Razorpay", "Musician", "Solo Traveller"];

export default function Hero() {
  const [nameHovered, setNameHovered] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setRoleIndex((i) => (i + 1) % ROLES.length);
    }, 2800);
    return () => clearInterval(id);
  }, []);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

        {/* Subtle music element illustrations — background decoration */}
        <div className="hero-music-bg" aria-hidden="true">
          {/* Guitar — top left */}
          <svg className="hm-icon hm-guitar" viewBox="0 0 48 110" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="18" y="2" width="12" height="18" rx="4"/>
            <line x1="20" y1="6" x2="16" y2="6"/><circle cx="15" cy="6" r="1.5" fill="currentColor" stroke="none"/>
            <line x1="20" y1="11" x2="16" y2="11"/><circle cx="15" cy="11" r="1.5" fill="currentColor" stroke="none"/>
            <line x1="28" y1="6" x2="32" y2="6"/><circle cx="33" cy="6" r="1.5" fill="currentColor" stroke="none"/>
            <line x1="28" y1="11" x2="32" y2="11"/><circle cx="33" cy="11" r="1.5" fill="currentColor" stroke="none"/>
            <line x1="24" y1="20" x2="24" y2="48"/>
            <rect x="20" y="20" width="8" height="28" rx="2"/>
            <path d="M20 48 C8 50 4 60 4 70 C4 85 13 96 24 96 C35 96 44 85 44 70 C44 60 40 50 28 48 Z"/>
            <circle cx="24" cy="70" r="9"/>
            <line x1="18" y1="88" x2="30" y2="88"/>
          </svg>

          {/* Microphone — top right */}
          <svg className="hm-icon hm-mic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="2" width="6" height="11" rx="3"/>
            <path d="M5 10a7 7 0 0 0 14 0"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </svg>

          {/* Beamed eighth notes — mid left */}
          <svg className="hm-icon hm-notes-l" viewBox="0 0 36 28" fill="currentColor" stroke="none">
            <circle cx="5" cy="22" r="4"/>
            <circle cx="22" cy="19" r="4"/>
            <rect x="8.5" y="7" width="2" height="15"/>
            <rect x="25.5" y="4" width="2" height="15"/>
            <rect x="8.5" y="7" width="19" height="2.5"/>
          </svg>

          {/* Single quarter note — mid right */}
          <svg className="hm-icon hm-notes-r" viewBox="0 0 18 28" fill="currentColor" stroke="none">
            <circle cx="5" cy="22" r="4.5"/>
            <rect x="8.5" y="4" width="2.5" height="18"/>
          </svg>

          {/* Treble clef — bottom right */}
          <svg className="hm-icon hm-clef" viewBox="0 0 32 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 60 C10 60 6 56 6 51 C6 44 12 40 18 38 C22 36 26 32 26 26 C26 18 20 12 14 10 C10 8 8 6 8 3 C8 1 10 0 12 0 C16 0 20 4 20 10 L20 50 C20 56 18 60 16 60 Z"/>
            <path d="M10 30 C10 30 6 32 6 37 C6 42 10 45 15 45"/>
          </svg>

          {/* Small note — top center-right */}
          <svg className="hm-icon hm-note-sm" viewBox="0 0 18 24" fill="currentColor" stroke="none">
            <circle cx="5" cy="19" r="4"/>
            <rect x="8.5" y="3" width="2" height="16"/>
            <rect x="8.5" y="3" width="8" height="2"/>
          </svg>
        </div>

        <div className="hero-top-row">
          <div className="hero-name-block">
            <div
              className="hero-banner-name"
              onMouseEnter={() => setNameHovered(true)}
              onMouseLeave={() => setNameHovered(false)}
            >
              <span className="name-sizer" aria-hidden="true">Jitender Sharma</span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={nameHovered ? "short" : "full"}
                  className="name-swap"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18, ease: "easeInOut" }}
                >
                  {nameHovered ? "Jeet" : "Jitender Sharma"}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="hero-eyebrow">
              <div className="hero-eyebrow-role-wrap">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={roleIndex}
                    className="hero-eyebrow-role"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                  >
                    {ROLES[roleIndex]}
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="hero-eyebrow-location">Bengaluru</div>
            </div>
          </div>
          <div className="hero-photo-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/jitender.png" alt="Jitender Sharma" className="hero-photo" />
          </div>
        </div>

        <p className="hero-intro">
          A product designer based in Bengaluru, India, bringing digital products to life with pixels and code.<br />
          Currently shaping B2B &amp; B2B2C experiences at Razorpay - from the first research conversation
          to the shipped interface. Research, product thinking, design, and code - the full loop.<br />
          Music, Travel &amp; fitness fill the rest.
        </p>

        <div className="logos-strip">
          <div className="logos-strip-label">Companies I&apos;ve worked with</div>
          <div className="logos-row">
            {COMPANIES.map(({ name, logo }, i) => (
              <div key={i} className="logo-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo} alt={name} className="logo-img" />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
