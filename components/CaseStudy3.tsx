"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

/* ─── 5 slides ─── */
const SLIDES = [
  "Cover",    // 0
  "Why",      // 1
  "Design",   // 2
  "Stack",    // 3
  "Outcome",  // 4
];

/* Footer section groups */
const SECTIONS = [
  { label: "Cover",   range: [0, 0] as [number, number] },
  { label: "Why",     range: [1, 1] as [number, number] },
  { label: "Design",  range: [2, 2] as [number, number] },
  { label: "Stack",   range: [3, 3] as [number, number] },
  { label: "Outcome", range: [4, 4] as [number, number] },
];

/* ── Slide image data ── */
const heroSlides = [
  { src: "/cs3/hero.png", annotation: "Homepage — Montserrat typography, name reveal animation, dark gradient background" },
  { src: "/cs3/work-cards.png", annotation: "Case study cards — hover effect with random word highlights in the hook text" },
];

const overlaySlides = [
  { src: "/cs3/case-study-overlay.png", annotation: "Case study overlay — full-screen slide-in with sticky progress nav tracking scroll position" },
  { src: "/cs3/code-structure.png", annotation: "Project structure — clean component architecture with case studies as separate overlays" },
];

export default function CaseStudy3({ isOpen, onClose }: Props) {
  const [slide, setSlide] = useState(0);
  const slideIdxRef = useRef(0);
  const stageRef    = useRef<HTMLDivElement>(null);
  const slideRefs   = useRef<(HTMLDivElement | null)[]>([]);

  /* Lock / unlock body scroll */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    if (!isOpen) {
      setSlide(0);
      slideIdxRef.current = 0;
      if (stageRef.current) stageRef.current.scrollTop = 0;
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  /* Browser back closes overlay */
  useEffect(() => {
    if (isOpen) window.history.pushState({ overlay: "cs3" }, "");
  }, [isOpen]);

  useEffect(() => {
    const onPop = () => onClose();
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [onClose]);

  /* Scroll stage to a specific slide index */
  const scrollToSlide = useCallback((idx: number) => {
    const el    = slideRefs.current[idx];
    const stage = stageRef.current;
    if (!el || !stage) return;
    const top = el.getBoundingClientRect().top
              - stage.getBoundingClientRect().top
              + stage.scrollTop;
    stage.scrollTo({ top, behavior: "smooth" });
  }, []);

  /* Navigate to adjacent slide */
  const go = useCallback((d: number) => {
    const next = Math.max(0, Math.min(SLIDES.length - 1, slideIdxRef.current + d));
    scrollToSlide(next);
  }, [scrollToSlide]);

  /* Jump to arbitrary slide */
  const goTo = useCallback((idx: number) => scrollToSlide(idx), [scrollToSlide]);

  /* Keyboard navigation */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown" || e.key === "ArrowRight") go(1);
      if (e.key === "ArrowUp"   || e.key === "ArrowLeft")  go(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  /* IntersectionObserver — keep footer nav in sync as user scrolls */
  useEffect(() => {
    if (!isOpen) return;
    const stage = stageRef.current;
    if (!stage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let best: { idx: number; ratio: number } | null = null;
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const idx = slideRefs.current.indexOf(entry.target as HTMLDivElement);
          if (idx !== -1 && entry.intersectionRatio > (best?.ratio ?? 0)) {
            best = { idx, ratio: entry.intersectionRatio };
          }
        });
        if (best !== null) {
          setSlide(best.idx);
          slideIdxRef.current = best.idx;
        }
      },
      { root: stage, threshold: [0.3, 0.5, 0.7] },
    );

    const refs = slideRefs.current;
    refs.forEach(ref => { if (ref) observer.observe(ref); });
    return () => observer.disconnect();
  }, [isOpen]);

  /* Scroll-triggered entrance animations for content within slides */
  useEffect(() => {
    if (!isOpen) return;
    const stage = stageRef.current;
    if (!stage) return;
    let observer: IntersectionObserver | undefined;
    const timer = window.setTimeout(() => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) e.target.classList.add("is-visible");
          });
        },
        { root: stage, threshold: 0.01 }
      );
      const targets = stage.querySelectorAll(".cs-sec-v2, .cs-v2-insight, .cs-v2-surface, .cs-stat-hero-row");
      targets.forEach((el) => observer!.observe(el));
    }, 300);
    return () => {
      window.clearTimeout(timer);
      observer?.disconnect();
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="overlay cs1-pres pf-pres"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }}
        >
          {/* ── Header ── */}
          <header className="cs1-ph">
            <button className="cs1-ph-back" onClick={onClose}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back
            </button>
            <div className="cs1-ph-center">
              <div className="cs1-ph-title">Portfolio Website, Built in Code</div>
            </div>
            <div className="cs1-ph-counter">
              {slide + 1} <span>/ {SLIDES.length}</span>
            </div>
          </header>

          {/* ── Stage — all slides stacked vertically, scroll-snapped ── */}
          <div className="cs1-ps" ref={stageRef}>

            {/* ── Slide 0: Cover ── */}
            <div ref={el => { slideRefs.current[0] = el; }} className="cs1-slide pf-slide-cover">
              <div className="cs1-si pf-si-cover">
                <div className="rc-dark-hero pf-dark-hero">
                  <div className="rc-dark-hero-glow pf-dark-hero-glow--green" />
                  <div className="rc-dark-hero-glow pf-dark-hero-glow--amber" />
                  <div className="rc-dark-hero-split">
                    <div className="rc-dark-hero-content">
                      <div className="rc-dark-hero-badge">Personal Project &middot; 2026</div>
                      <h1 className="rc-dark-hero-title">
                        Portfolio Website,<br />
                        <span className="rc-dark-hero-ai">Built in Code</span>
                      </h1>
                      <p className="rc-dark-hero-sub">
                        No templates. No design handoffs. Every interaction designed{" "}
                        <strong>from scratch in code</strong> using Claude Code as a thinking partner.
                      </p>
                      <div className="rc-dark-hero-tagline">Design &middot; Code &middot; Ship</div>
                    </div>
                    <div className="rc-dark-hero-mockup">
                      <div className="pf-mockup-wrap">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/cs1/portfolio.png" alt="Portfolio website on MacBook" className="pf-mockup-img" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="cs-v2-overview pf-cs-overview">
                  {[
                    ["Role", "Design · Frontend Development"],
                    ["Timeline", "2 weeks"],
                    ["Stack", "Next.js, TypeScript, Tailwind, Framer Motion"],
                    ["Approach", "Design in code, iterate fast, ship clean"],
                  ].map(([k, v]) => (
                    <div className="cs-v2-overview-item" key={k}>
                      <div className="cs-v2-overview-key">{k}</div>
                      <div className="cs-v2-overview-val">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Slide 1: Why ── */}
            <div ref={el => { slideRefs.current[1] = el; }} className="cs1-slide">
              <div className="cs1-si">
                <div className="cs-sec-v2">
                  <div className="cs-sec-v2-label">01 &middot; Why</div>
                  <h2 className="cs-sec-v2-h">
                    Most portfolios use templates. This one reflects how I actually work.
                  </h2>

                  <p className="cs-sec p">
                    Designer portfolios often follow a formula: pick a theme, drop in case studies, call it done.
                    But a portfolio should show <em>how</em> you think, not just what you&apos;ve shipped.
                  </p>

                  <p className="cs-sec p">
                    I wanted mine to reflect my actual process — where design and code aren&apos;t separate phases,
                    but one continuous conversation. So I built it from scratch using Claude Code as a thinking
                    partner: designing interactions directly in code, iterating in the browser, shipping clean.
                  </p>

                  <div className="cs-v2-callout">
                    <div className="cs-v2-callout-label">Design Principle</div>
                    <div className="cs-v2-callout-text">
                      &ldquo;Design decisions extend all the way to implementation — not just how things look,
                      but how they&apos;re built, how they move, how they feel.&rdquo;
                    </div>
                  </div>

                  <div className="cs-personas" style={{ marginTop: 40 }}>
                    {[
                      ["No templates", "Every component designed from scratch — no Webflow, no Framer starter kit."],
                      ["Design in code", "Interactions prototyped directly in React + Framer Motion, not handed off from Figma."],
                      ["Claude Code as partner", "Used Claude Code to think through motion curves, layout trade-offs, and component structure in real time."],
                      ["Ship fast, iterate faster", "Launched in 2 weeks. Every feature tested in browser before locking in."],
                    ].map(([name, sub]) => (
                      <div key={name} className="cs-persona">
                        <div className="cs-persona-name">{name}</div>
                        <div className="cs-persona-sub">{sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Slide 2: Design ── */}
            <div ref={el => { slideRefs.current[2] = el; }} className="cs1-slide">
              <div className="cs1-si">
                <div className="cs-sec-v2">
                  <div className="cs-sec-v2-label">02 &middot; Design</div>
                  <h2 className="cs-sec-v2-h">
                    Typography, motion, and interaction designed to feel intentional.
                  </h2>

                  <p className="cs-sec p">
                    The design centers on a few deliberate choices: Montserrat for the hero name,
                    custom animations for every transition, and interactive elements that reward attention
                    without demanding it.
                  </p>

                  {/* Surface 1 — Hero & Typography */}
                  <div className="cs-v2-surface">
                    <div className="cs-v2-surface-meta">
                      <span className="cs-v2-surface-num">Surface 1</span>
                      <span className="cs-v2-surface-role">Homepage hero</span>
                    </div>
                    <h3 className="cs-v2-surface-title">Hero: Name reveal animation</h3>
                    <p className="cs-sec p">
                      The hero uses Montserrat — a clean geometric sans with strong character. The name appears
                      letter-by-letter in random order using Framer Motion, each with its own delay and
                      entrance curve. Simple, unexpected, sets the tone for the rest of the site.
                    </p>

                    <div style={{ marginTop: 24 }}>
                      {heroSlides.map((s, i) => (
                        <div key={i} style={{ marginBottom: i < heroSlides.length - 1 ? 32 : 0 }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={s.src} alt={s.annotation} style={{ width: "100%", height: "auto", borderRadius: 8, border: "1px solid rgba(0,0,0,0.08)" }} />
                          <div className="cs-img-cap" style={{ marginTop: 12 }}>{s.annotation}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="cs-v2-insight">
                    <h3 className="cs-sub">Motion &amp; easing</h3>
                    <p className="cs-sec p">
                      Every animation uses custom easing curves — no generic linear transitions. Card hovers,
                      overlay slide-ins, and scroll-triggered entrance animations all feel natural because the
                      timing was tuned in browser, not guessed in Figma.
                    </p>
                  </div>

                  <div className="cs-v2-insight">
                    <h3 className="cs-sub">Interactive elements</h3>
                    <p className="cs-sec p">
                      Case study cards highlight random words in the hook text on hover. Custom cursor states
                      (pointer, default) designed as SVGs to match the aesthetic. The music player runs globally,
                      preloading tracks to avoid playback delays.
                    </p>
                  </div>

                  <div className="cs-personas" style={{ marginTop: 40 }}>
                    {[
                      ["Typography", "Montserrat (hero) + Space Grotesk (body). Loaded locally for performance."],
                      ["Color system", "Dark gradients + CSS variables for theming. No hardcoded hex values in components."],
                      ["Noise texture", "Global grain overlay adds texture without fighting readability."],
                      ["Custom cursor", "SVG cursor states designed to feel cohesive with the rest of the UI."],
                    ].map(([name, sub]) => (
                      <div key={name} className="cs-persona">
                        <div className="cs-persona-name">{name}</div>
                        <div className="cs-persona-sub">{sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Slide 3: Stack ── */}
            <div ref={el => { slideRefs.current[3] = el; }} className="cs1-slide">
              <div className="cs1-si">
                <div className="cs-sec-v2">
                  <div className="cs-sec-v2-label">03 &middot; Stack</div>
                  <h2 className="cs-sec-v2-h">
                    Next.js, Tailwind, Framer Motion. Component architecture designed for clarity.
                  </h2>

                  <p className="cs-sec p">
                    Built with Next.js 15 App Router for performance and clean routing. TypeScript for type
                    safety. Tailwind for layout and responsive design. Framer Motion for all animations.
                  </p>

                  <div className="cs-v2-insight">
                    <h3 className="cs-sub">Next.js 15 + TypeScript</h3>
                    <p className="cs-sec p">
                      App Router handles navigation. TypeScript enforces types across components. All
                      client-side animations use Framer Motion for smooth, declarative transitions.
                    </p>
                  </div>

                  <div className="cs-v2-insight">
                    <h3 className="cs-sub">Tailwind CSS + custom utilities</h3>
                    <p className="cs-sec p">
                      Tailwind handles layout and responsive design. Custom utility classes keep markup clean.
                      CSS variables manage theming (dark mode, color tokens, font stacks).
                    </p>
                  </div>

                  {/* Surface 2 — Component Architecture */}
                  <div className="cs-v2-surface">
                    <div className="cs-v2-surface-meta">
                      <span className="cs-v2-surface-num">Surface 2</span>
                      <span className="cs-v2-surface-role">Architecture</span>
                    </div>
                    <h3 className="cs-v2-surface-title">Component structure</h3>
                    <p className="cs-sec p">
                      Case studies load as full-screen overlays — separate components that animate in from
                      the bottom. Session storage handles scroll position restoration after navigation.
                      Music player, custom cursor, and noise texture run as global components. Everything
                      else is lazy-loaded to keep initial page weight low.
                    </p>

                    <div style={{ marginTop: 24 }}>
                      {overlaySlides.map((s, i) => (
                        <div key={i} style={{ marginBottom: i < overlaySlides.length - 1 ? 32 : 0 }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={s.src} alt={s.annotation} style={{ width: "100%", height: "auto", borderRadius: 8, border: "1px solid rgba(0,0,0,0.08)" }} />
                          <div className="cs-img-cap" style={{ marginTop: 12 }}>{s.annotation}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="cs-personas" style={{ marginTop: 40 }}>
                    {[
                      ["Component isolation", "Each case study is a separate overlay component with its own scroll state."],
                      ["Shared state", "React Context manages global state (music player, custom cursor)."],
                      ["Scroll restoration", "Session storage preserves scroll position when navigating back from overlays."],
                      ["Lazy loading", "Images and heavy components load on-demand to keep initial bundle small."],
                    ].map(([name, sub]) => (
                      <div key={name} className="cs-persona">
                        <div className="cs-persona-name">{name}</div>
                        <div className="cs-persona-sub">{sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Slide 4: Outcome ── */}
            <div ref={el => { slideRefs.current[4] = el; }} className="cs1-slide">
              <div className="cs1-si">
                <div className="cs-sec-v2">
                  <div className="cs-sec-v2-label">04 &middot; Outcome</div>
                  <h2 className="cs-sec-v2-h">
                    Live portfolio. Fast, clean, built exactly the way I wanted.
                  </h2>

                  <p className="cs-sec p">
                    Shipped in 2 weeks. Every feature tested in browser before locking in. Performance
                    optimized: lazy-loaded images, optimized fonts, minimal JavaScript bundle.
                  </p>

                  <div className="cs-stat-hero-row cs-stat-hero-row--outcome">
                    <div className="cs-stat-hero">
                      <div className="cs-stat-hero-num">2 weeks</div>
                      <div className="cs-stat-hero-label">From first commit to live deployment</div>
                    </div>
                    <div className="cs-stat-hero">
                      <div className="cs-stat-hero-num">0</div>
                      <div className="cs-stat-hero-label">Templates used — every component built from scratch</div>
                    </div>
                    <div className="cs-stat-hero">
                      <div className="cs-stat-hero-num">100%</div>
                      <div className="cs-stat-hero-label">Design decisions made in code, not handed off</div>
                    </div>
                  </div>

                  <div className="cs-v2-reflect" style={{ marginTop: 48 }}>
                    <div className="cs-v2-reflect-item">
                      <div className="cs-v2-persp-header">
                        <svg className="cs-v2-persp-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/>
                        </svg>
                        <span className="cs-v2-persp-title">What worked</span>
                      </div>
                      <ul className="cs-v2-persp-list">
                        <li>Designing in code let me iterate on motion and interaction in real time</li>
                        <li>Claude Code as a thinking partner accelerated every decision — from easing curves to component structure</li>
                        <li>No templates meant every interaction was intentional, not inherited</li>
                        <li>Shipping fast forced clarity — no room for half-finished features</li>
                      </ul>
                    </div>
                    <div className="cs-v2-reflect-item">
                      <div className="cs-v2-persp-header">
                        <svg className="cs-v2-persp-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 8v4m0 4h.01M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/>
                        </svg>
                        <span className="cs-v2-persp-title">What I learned</span>
                      </div>
                      <ul className="cs-v2-persp-list">
                        <li>Building from scratch surfaces what actually matters — every abstraction is earned</li>
                        <li>Motion design is clearer when you can test it immediately in browser</li>
                        <li>Performance matters even for portfolios — lazy loading and font optimization make a difference</li>
                        <li>Designing in code doesn&apos;t mean sacrificing craft — it means shipping craft faster</li>
                      </ul>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>{/* /cs1-ps */}

          {/* ── Arrows — live outside the scroll container so they don't scroll away ── */}
          {slide > 0 && (
            <button className="cs1-arrow cs1-arrow-prev" onClick={() => go(-1)} aria-label="Previous slide">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 13L9 5m0 0L5 9m4-4l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
          {slide < SLIDES.length - 1 && (
            <button className="cs1-arrow cs1-arrow-next" onClick={() => go(1)} aria-label="Next slide">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 5l0 8m0 0l4-4m-4 4l-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}

          {/* ── Footer ── */}
          <footer className="cs1-pf">
            <div className="cs1-pf-sections">
              {SECTIONS.map(({ label, range }) => {
                const [from, to] = range;
                const isActive = slide >= from && slide <= to;
                return (
                  <div key={label} className={`cs1-pf-section${isActive ? " active" : ""}`}>
                    <button className="cs1-pf-section-label" onClick={() => goTo(from)}>{label}</button>
                    <div className="cs1-pf-section-dots">
                      {Array.from({ length: to - from + 1 }, (_, i) => from + i).map((idx) => (
                        <button
                          key={idx}
                          className={`cs1-pdot${idx === slide ? " active" : ""}`}
                          onClick={() => goTo(idx)}
                          title={SLIDES[idx]}
                          aria-label={SLIDES[idx]}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
