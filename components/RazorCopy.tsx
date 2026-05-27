"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

/* ─── 6 slides ─── */
const SLIDES = [
  "Cover",                      // 0
  "Problem",                    // 1
  "Solution",                   // 2
  "Tone Modes",                 // 3
  "Decisions",                  // 4
  "Tech & Learnings",          // 5
];

/* All slides are hero slides in this deck */
const HERO_SLIDES = new Set([0, 1, 2, 3, 4, 5]);

/* Footer section groups */
const SECTIONS = [
  { label: "Cover",      range: [0, 0]   as [number, number] },
  { label: "Problem",    range: [1, 1]   as [number, number] },
  { label: "Solution",   range: [2, 2]   as [number, number] },
  { label: "Tone",       range: [3, 3]   as [number, number] },
  { label: "Decisions",  range: [4, 4]   as [number, number] },
  { label: "Tech",       range: [5, 5]   as [number, number] },
];

export default function RazorCopy({ isOpen, onClose }: Props) {
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
    if (isOpen) window.history.pushState({ overlay: "rc" }, "");
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
        let bestIdx = -1;
        let bestRatio = 0;
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const idx = slideRefs.current.indexOf(entry.target as HTMLDivElement);
          if (idx !== -1 && entry.intersectionRatio > bestRatio) {
            bestIdx = idx;
            bestRatio = entry.intersectionRatio;
          }
        });
        if (bestIdx !== -1) {
            setSlide(bestIdx);
            slideIdxRef.current = bestIdx;
        }
      },
      { root: stage, threshold: [0.3, 0.5, 0.7] },
    );

    const refs = slideRefs.current;
    refs.forEach(ref => { if (ref) observer.observe(ref); });
    return () => observer.disconnect();
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="overlay cs1-pres rc-pres"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] as [number,number,number,number] }}
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
              <div className="cs1-ph-title">RazorCopy — AI Copy Assistant</div>
            </div>
            <div className="cs1-ph-counter">
              {slide + 1} <span>/ {SLIDES.length}</span>
            </div>
          </header>

          {/* ── Stage — all slides stacked vertically, scroll-snapped ── */}
          <div className="cs1-ps" ref={stageRef}>
            {SLIDES.map((_, idx) => (
              <div
                key={idx}
                ref={el => { slideRefs.current[idx] = el; }}
                className="cs1-slide rc-slide"
              >
                <SlideContent index={idx} />
              </div>
            ))}
          </div>

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
                    <div className="cs1-pf-section-label">{label}</div>
                    <div className="cs1-pf-section-dots">
                      {Array.from({ length: to - from + 1 }, (_, i) => from + i).map((idx) => (
                        <button
                          key={idx}
                          className={`cs1-pdot${idx === slide ? " active" : ""}${HERO_SLIDES.has(idx) ? " hero" : ""}`}
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

/* ─────────────────────────────────────────────────────────
   Slide routing
───────────────────────────────────────────────────────── */

function SlideContent({ index }: { index: number }) {
  switch (index) {
    case 0: return <SlideCover />;
    case 1: return <SlideProblem />;
    case 2: return <SlideSolution />;
    case 3: return <SlideToneModes />;
    case 4: return <SlideDecisions />;
    case 5: return <SlideTech />;
    default: return null;
  }
}

/* ─────────────────────────────────────────────────────────
   Slide 0 — Cover
───────────────────────────────────────────────────────── */

function SlideCover() {
  return (
    <div className="cs1-si rc-si-cover">
      {/* Dark atmospheric hero banner */}
      <div className="rc-dark-hero">
        <div className="rc-dark-hero-glow rc-dark-hero-glow--teal" />
        <div className="rc-dark-hero-glow rc-dark-hero-glow--red" />

        <div className="rc-dark-hero-split">
          {/* Left side - Icon and text */}
          <div className="rc-dark-hero-content">
            <div className="rc-hero-icon">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <rect width="80" height="80" rx="16" fill="url(#iconGrad)" />
                <path d="M40 20L50 35H30L40 20Z" fill="white" opacity="0.9" />
                <path d="M40 60L30 45H50L40 60Z" fill="white" opacity="0.9" />
                <defs>
                  <linearGradient id="iconGrad" x1="0" y1="0" x2="80" y2="80">
                    <stop offset="0%" stopColor="#0EA5E9" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1 className="rc-dark-hero-title"><span className="rc-dark-hero-ai">AI</span> RazorCopy</h1>
            <p className="rc-dark-hero-sub">AI-powered UX <strong>Copy Assistant</strong> for Figma</p>
            <div className="rc-dark-hero-tagline">Select → Refine → Apply</div>
          </div>

          {/* Right side - Plugin mockup with glow */}
          <div className="rc-dark-hero-mockup">
            <div className="rc-mockup-glow-wrap">
              <img src="/cs1/RazorCopy.png" alt="RazorCopy plugin UI" className="rc-dark-hero-img" />
              {/* Figma-style cursor pointing at Apply CTA */}
              <div className="rc-figma-cursor">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M5 3L19 12L12 13L9 20L5 3Z" fill="black" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rc-cover-hero">
        <div className="rc-cover-badge">Overview</div>
        <p className="cs-v2-hook">
          Designers at Razorpay were writing UX copy across 40+ screens with no shared tone,
          no consistent voice, and constant context-switching to docs and Notion. I built a
          Figma plugin that refines copy in-place using AI — the entire workflow stays inside
          the canvas.
        </p>
      </div>

      <div className="cs-v2-overview">
        {[
          ["Type", "Figma Plugin"],
          ["Stack", "HTML · CSS · JS · OpenAI API"],
          ["Scope", "Built & shipped at Razorpay"],
          ["Context", "Internal design tooling"],
        ].map(([k, v]) => (
          <div className="cs-v2-overview-item" key={k}>
            <div className="cs-v2-overview-key">{k}</div>
            <div className="cs-v2-overview-val">{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Slide 1 — Problem
───────────────────────────────────────────────────────── */

function SlideProblem() {
  return (
    <div className="cs1-si rc-si-problem">
      <div className="cs-sec-v2-label">02 · Problem</div>
      <h2 className="cs-sec-v2-h">Writing UX copy is slow<br />and inconsistent.</h2>
      <p className="cs-sec-v2-intro">
        Designers aren&apos;t UX writers. But they write copy all day — button labels,
        error states, empty states, onboarding prompts. Without a shared voice or fast
        tooling, every screen ends up sounding slightly different.
      </p>

      <div className="cs-v2-persp-grid">
        {[
          { icon: "⏱", title: "SLOW ITERATION", body: "Writing and rewriting across 40+ screens is tedious. One tone change means updating dozens of text nodes manually." },
          { icon: "🎭", title: "TONE DRIFT", body: "Merchant-facing flows sound friendly. Customer-facing flows sound clinical. No one noticed until it was flagged in a design review." },
          { icon: "✍️", title: "SKILL GAP", body: "Designers are trained in layout, hierarchy, and interaction — not in copy craft. UX writing requires a different muscle." },
          { icon: "🔀", title: "CONTEXT SWITCH", body: "The fix was to open a doc, find the tone guide, write something, paste it back. Every iteration broke the design flow." },
        ].map((c, i) => (
          <div className="cs-v2-persp" key={i}>
            <div className="cs-v2-persp-header">
              <span className="cs-v2-persp-icon">{c.icon}</span>
              <span className="cs-v2-persp-title">{c.title}</span>
            </div>
            <ul className="cs-v2-persp-list">
              <li>{c.body}</li>
            </ul>
          </div>
        ))}
      </div>

      <div className="rc-before-after">
        <div className="rc-ba-col rc-ba-before">
          <div className="rc-ba-label">Before — inconsistent copy</div>
          <div className="rc-ba-block">
            <div className="rc-ba-item rc-ba-bad">"Error occurred. Please try again."</div>
            <div className="rc-ba-item rc-ba-bad">"Submit form to complete onboarding"</div>
            <div className="rc-ba-item rc-ba-bad">"This field cannot be left blank."</div>
          </div>
        </div>
        <div className="rc-ba-col rc-ba-after">
          <div className="rc-ba-label">After — RazorCopy refined</div>
          <div className="rc-ba-block">
            <div className="rc-ba-item rc-ba-good">"Something went wrong. Give it another try."</div>
            <div className="rc-ba-item rc-ba-good">"You&apos;re almost set up. Finish in one step."</div>
            <div className="rc-ba-item rc-ba-good">"This field is required to continue."</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Slide 2 — Solution
───────────────────────────────────────────────────────── */

function SlideSolution() {
  return (
    <div className="cs1-si rc-si-solution">
      <div className="cs-sec-v2-label">03 · Solution</div>
      <h2 className="cs-sec-v2-h">Copy refinement that lives<br />inside Figma.</h2>
      <p className="cs-sec-v2-intro">
        What if you never had to leave the canvas to fix copy? RazorCopy is a Figma plugin
        that reads your selected text, applies Razorpay&apos;s tone guidelines via AI, and
        lets you preview and apply the refined version — without switching a single tab.
      </p>

      <div className="rc-solution-grid">
        {[
          { label: "No prompt writing", detail: "Designers choose a mode — not a prompt. The AI handles the translation." },
          { label: "Preview before apply", detail: "Original and refined copy sit side by side. Nothing changes until you confirm." },
          { label: "Stays in Figma", detail: "No tab-switching, no copy-pasting. The whole flow is a right-click away." },
          { label: "Razorpay voice baked in", detail: "The AI is pre-primed with Razorpay's brand tone. Designers don't need to know the guidelines." },
        ].map((s, i) => (
          <div className="rc-sol-card" key={i}>
            <div className="rc-sol-label">{s.label}</div>
            <div className="rc-sol-detail">{s.detail}</div>
          </div>
        ))}
      </div>

      <div className="cs-subsec-h">How it works</div>
      <div className="rc-steps">
        {[
          { n: "01", title: "Select text or frame", detail: "Click any text node or frame in Figma. RazorCopy reads all text within the selection." },
          { n: "02", title: "Choose a tone mode", detail: "Pick from three context-aware modes: Razorpay default, Merchant-facing, or Customer-facing." },
          { n: "03", title: "Refine copy", detail: "Hit Refine. The plugin sends selected text to OpenAI with the appropriate tone prompt." },
          { n: "04", title: "Review changes", detail: "Original and refined versions appear side by side. Diff-highlighted so you see exactly what changed." },
          { n: "05", title: "Apply to Figma", detail: "One click applies the refined copy back to the exact text nodes — non-destructively." },
        ].map((s, i) => (
          <div className="rc-step-row" key={i}>
            <div className="rc-step-num">{s.n}</div>
            <div className="rc-step-content">
              <div className="rc-step-title">{s.title}</div>
              <div className="rc-step-detail">{s.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Slide 3 — Tone Modes
───────────────────────────────────────────────────────── */

function SlideToneModes() {
  return (
    <div className="cs1-si rc-si-tone">
      <div className="cs-sec-v2-label">04 · Tone modes</div>
      <h2 className="cs-sec-v2-h">Context-aware refinement,<br />not one-size-fits-all.</h2>
      <p className="cs-sec-v2-intro">
        The same copy reads very differently depending on who&apos;s reading it. A merchant
        needs directness. A customer needs warmth. Razorpay&apos;s internal tools need
        balance. Three modes, same input.
      </p>

      <div className="rc-tone-grid">
        {[
          {
            mode: "Razorpay Default",
            desc: "Balanced product tone — clear, professional, and on-brand.",
            badge: "Default",
            example: "Your payout has been processed. Check your bank account within 2 business days.",
            color: "#0052CC",
          },
          {
            mode: "Merchant-facing",
            desc: "Direct and efficient. Merchants need facts, not fluff.",
            badge: "Merchant",
            example: "Payout done. Funds in your account in 2 days.",
            color: "#1a7f37",
          },
          {
            mode: "Customer-facing",
            desc: "Friendly and simple. Customers need reassurance, not jargon.",
            badge: "Customer",
            example: "Great news! Your payment went through. You'll see it in your account soon.",
            color: "#9333ea",
          },
        ].map((t, i) => (
          <div className="rc-tone-card" key={i} style={{ "--rc-tone-color": t.color } as React.CSSProperties}>
            <div className="rc-tone-badge" style={{ color: t.color, borderColor: t.color + "33", background: t.color + "0f" }}>{t.badge}</div>
            <div className="rc-tone-mode">{t.mode}</div>
            <div className="rc-tone-desc">{t.desc}</div>
            <div className="rc-tone-example">&ldquo;{t.example}&rdquo;</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Slide 4 — Key Decisions
───────────────────────────────────────────────────────── */

function SlideDecisions() {
  return (
    <div className="cs1-si rc-si-decisions">
      <div className="cs-sec-v2-label">05 · Key decisions</div>
      <h2 className="cs-sec-v2-h">Designing for trust<br />and usability.</h2>
      <p className="cs-sec-v2-intro">
        Every product decision in this plugin came from watching designers avoid tools that
        interrupted their flow. The goal was zero friction — and zero risk.
      </p>

      <div className="rc-decisions">
        {[
          {
            n: "01",
            title: "Non-destructive by default",
            body: "Copy is never overwritten without explicit confirmation. You always see original and refined side by side before applying. Trust is built through control.",
          },
          {
            n: "02",
            title: "Modes, not prompts",
            body: "Designers shouldn't need to know prompt engineering. Abstracting the AI behind three clear modes removes the skill barrier entirely.",
          },
          {
            n: "03",
            title: "Minimal surface, maximum focus",
            body: "The plugin panel is small by design. No settings sprawl, no onboarding flows. Open it, do the thing, close it. Cognitive load stays on the design work.",
          },
          {
            n: "04",
            title: "Works on frames, not just text nodes",
            body: "Selecting a full frame extracts all child text. This means you can refine an entire screen's copy in a single pass — no node-by-node selection.",
          },
        ].map((d, i) => (
          <div className="rc-decision-row" key={i}>
            <div className="rc-decision-n">{d.n}</div>
            <div className="rc-decision-body">
              <div className="rc-decision-title">{d.title}</div>
              <div className="rc-decision-text">{d.body}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Slide 5 — Tech & Learnings
───────────────────────────────────────────────────────── */

function SlideTech() {
  return (
    <div className="cs1-si rc-si-tech">
      <div className="cs-sec-v2-label">06 · Tech &amp; learnings</div>
      <h2 className="cs-sec-v2-h">From idea to<br />working plugin.</h2>

      <div className="cs-subsec-h">How it&apos;s built</div>
      <div className="rc-arch">
        {["Figma canvas", "Plugin (HTML/JS)", "OpenAI API", "Refined copy", "Back to Figma"].map((node, i, arr) => (
          <div key={i} className="rc-arch-item">
            <div className="rc-arch-node">{node}</div>
            {i < arr.length - 1 && <div className="rc-arch-arrow">→</div>}
          </div>
        ))}
      </div>

      <div className="rc-tech-tags">
        {["HTML", "CSS", "JavaScript", "Figma Plugin API", "OpenAI API", "Cursor IDE"].map(t => (
          <span className="rc-tech-tag" key={t}>{t}</span>
        ))}
      </div>

      <div className="cs-subsec-h">What this unlocks</div>
      <div className="rc-impact-grid">
        {[
          { stat: "Faster", label: "copy iteration across screens" },
          { stat: "Zero", label: "context-switching during copy review" },
          { stat: "One click", label: "to apply refined copy to any frame" },
          { stat: "3 modes", label: "covering all Razorpay product surfaces" },
        ].map((s, i) => (
          <div className="rc-impact-card" key={i}>
            <div className="rc-impact-stat">{s.stat}</div>
            <div className="rc-impact-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="cs-subsec-h">What I learned</div>
      <div className="rc-learnings">
        {[
          { title: "AI is only as good as its prompt design", body: "The tone modes work because the system prompts were iterated carefully. Writing good prompts is its own design discipline." },
          { title: "Plugins are high-leverage tools", body: "One plugin, used by every designer on a team, multiplies quality across the entire product. Small tools create outsized workflow impact." },
          { title: "Understanding code unlocks speed", body: "Building in HTML/JS inside the Figma plugin sandbox meant I could prototype, test, and ship without waiting on anyone." },
          { title: "Constraints sharpen decisions", body: "The plugin panel is tiny. That forced every UI element to earn its place. No padding to hide in." },
        ].map((l, i) => (
          <div className="rc-learning-row" key={i}>
            <div className="rc-learning-title">{l.title}</div>
            <div className="rc-learning-text">{l.body}</div>
          </div>
        ))}
      </div>

      <div className="cs-subsec-h">What&apos;s next</div>
      <div className="rc-roadmap">
        {[
          "Checkbox-based node selection — apply copy only to selected items",
          "Character count controls — set max length per copy block",
          "Re-scan selections — refresh text after Figma edits",
          "Individual apply per node — granular control instead of all-or-nothing",
        ].map((item, i) => (
          <div className="rc-roadmap-item" key={i}>
            <span className="rc-roadmap-dot" />
            <span>{item}</span>
          </div>
        ))}
      </div>

      <div className="rc-closing">
        <div className="rc-closing-line">Designing tools, not just screens.</div>
        <p className="rc-closing-sub">
          RazorCopy embeds intelligence directly into the design workflow.
          The best tool is the one you forget you&apos;re using.
        </p>
      </div>
    </div>
  );
}
