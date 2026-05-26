"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

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

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 750], [1, 0.86]);
  const borderRadius = useTransform(scrollY, [0, 750], [0, 0]);
  const innerOpacity = useTransform(scrollY, [300, 750], [1, 0.62]);

  return (
    <section id="home" ref={sectionRef}>
      <motion.div
        className="hero-card"
        style={{ scale, borderRadius, opacity: innerOpacity }}
      >
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
          Senior Product Designer with 7+ years shipping scalable fintech products at Razorpay and PayU.<br />
          I work the full loop — research, product thinking, design, and code — from the first conversation
          to the shipped interface.<br />
          Music, travel &amp; fitness fill the rest.
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
