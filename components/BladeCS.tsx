"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SLIDES = [
  "Cover",        // 0
  "Process",      // 1
  "Methods",      // 2
  "Coverage",     // 3
  "Challenges",   // 4
  "Outcome",      // 5
];

const HERO_SLIDES = new Set<number>([]);

const SECTIONS = [
  { label: "Cover",      range: [0, 0] as [number, number] },
  { label: "Process",    range: [1, 1] as [number, number] },
  { label: "Methods",    range: [2, 2] as [number, number] },
  { label: "Coverage",   range: [3, 3] as [number, number] },
  { label: "Challenges", range: [4, 4] as [number, number] },
  { label: "Outcome",    range: [5, 5] as [number, number] },
];

export default function BladeCS({ isOpen, onClose }: Props) {
  const [slide, setSlide]     = useState(0);
  const slideIdxRef           = useRef(0);
  const stageRef              = useRef<HTMLDivElement>(null);
  const slideRefs             = useRef<(HTMLDivElement | null)[]>([]);

  /* Body scroll lock */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    if (!isOpen) {
      setSlide(0);
      slideIdxRef.current = 0;
      if (stageRef.current) stageRef.current.scrollTop = 0;
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  /* Browser back → close */
  useEffect(() => {
    if (isOpen) window.history.pushState({ overlay: "blade" }, "");
  }, [isOpen]);
  useEffect(() => {
    const onPop = () => onClose();
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [onClose]);

  /* Smooth scroll to a slide */
  const scrollToSlide = useCallback((idx: number) => {
    const el    = slideRefs.current[idx];
    const stage = stageRef.current;
    if (!el || !stage) return;
    const top = el.getBoundingClientRect().top
              - stage.getBoundingClientRect().top
              + stage.scrollTop;
    stage.scrollTo({ top, behavior: "smooth" });
  }, []);

  const go   = useCallback((d: number) => {
    const next = Math.max(0, Math.min(SLIDES.length - 1, slideIdxRef.current + d));
    scrollToSlide(next);
  }, [scrollToSlide]);

  const goTo = useCallback((idx: number) => scrollToSlide(idx), [scrollToSlide]);

  /* Keyboard navigation */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")                                { onClose(); return; }
      if (e.key === "ArrowDown" || e.key === "ArrowRight")   go(1);
      if (e.key === "ArrowUp"   || e.key === "ArrowLeft")    go(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  /* IntersectionObserver — keep footer in sync while scrolling */
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
              <div className="cs1-ph-title">Optimizer Dashboard — Vibe to Blade</div>
            </div>
            <div className="cs1-ph-counter">
              {slide + 1} <span>/ {SLIDES.length}</span>
            </div>
          </header>

          {/* ── Stage — all slides stacked vertically ── */}
          <div className="cs1-ps" ref={stageRef}>
            {SLIDES.map((_, idx) => (
              <div
                key={idx}
                ref={el => { slideRefs.current[idx] = el; }}
                className="cs1-slide"
              >
                <SlideContent index={idx} />
              </div>
            ))}
          </div>

          {/* ── Arrows ── */}
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
    case 1: return <SlideProcess />;
    case 2: return <SlideMethods />;
    case 3: return <SlideCoverage />;
    case 4: return <SlideChallenges />;
    case 5: return <SlideOutcome />;
    default: return null;
  }
}

/* ─────────────────────────────────────────────────────────
   Slide 0 — Cover  (two-column hero, matching CS1 style)
───────────────────────────────────────────────────────── */

function SlideCover() {
  return (
    <div className="cs1-si rc-si-cover">
      {/* Dark atmospheric hero banner */}
      <div className="rc-dark-hero bd-dark-hero">
        <div className="rc-dark-hero-glow bd-dark-hero-glow--purple" />
        <div className="rc-dark-hero-glow bd-dark-hero-glow--blue" />

        <div className="rc-dark-hero-split">
          {/* Left — title + hook */}
          <div className="rc-dark-hero-content">
            <div className="rc-dark-hero-badge">Frontend Development</div>
            <h1 className="rc-dark-hero-title">
              Optimizer<br />Dashboard,<br />
              <span className="rc-dark-hero-ai">Vibe to Blade</span>
            </h1>
            <p className="rc-dark-hero-sub">
              Vibe-coded dashboard migrated to{" "}
              <strong>Razorpay&apos;s Blade Design System</strong> — 7 phases,
              92% compliance, 30-second setup.
            </p>
            <div className="rc-dark-hero-tagline">Design → Code → Blade</div>
          </div>

          {/* Right — laptop mockup */}
          <div className="rc-dark-hero-mockup">
            <div className="bd-mockup-glow-wrap">
              <img
                src="/cs1/VibeCoding.png"
                alt="Optimizer Dashboard — Blade migration"
                className="bd-dark-hero-img"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Meta row */}
      <div className="cs1-meta">
        {[
          ["Type",     "Frontend Development"],
          ["Stack",    "React 18 · TypeScript · Vite"],
          ["System",   "Razorpay Blade v12"],
          ["Method",   "Vibe-coded → Production-ready"],
        ].map(([label, val]) => (
          <div className="cs1-meta-cell" key={label}>
            <div className="cs1-meta-label">{label}</div>
            <div className="cs1-meta-val">{val}</div>
          </div>
        ))}
      </div>

      {/* Outcomes strip */}
      <div className="cs1-cover-outcomes bd-cover-outcomes">
        {[
          ["92%",      "Blade compliance achieved"],
          ["7 phases", "Structured migration process"],
          ["30 sec",   "Project setup vs. 30-min traditional flow"],
        ].map(([num, label]) => (
          <div className="cs1-cover-outcome-cell" key={num}>
            <div className="cs1-cover-outcome-n bd-cover-outcome-n">{num}</div>
            <div className="cs1-cover-outcome-l">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Slide 1 — Process
───────────────────────────────────────────────────────── */

function SlideProcess() {
  const phases = [
    { n: "01", title: "Claude Design → React Base", desc: "Exported vibe-coded ZIP from Claude Design. Converted HTML/CSS/JS to React + TypeScript using Vite scaffold." },
    { n: "02", title: "Automated Blade Migration", desc: "Ran /migrate-to-blade skill. Achieved 60–65% coverage automatically — layout, typography, basic inputs done." },
    { n: "03", title: "Challenge Analysis", desc: "Identified components where auto-migration changed the UX. Custom dropdowns, multi-select filters, nav tabs flagged for manual work." },
    { n: "04", title: "Manual Refinement", desc: "Fixed issues using Agentation (visual tagging), Snip (element capture), Plan Mode (checklist-driven), and screenshot context." },
    { n: "05", title: "Coverage Analysis", desc: "Generated Blade coverage report. Tracked per-component compliance scores, identified easy wins vs complex rebuilds." },
    { n: "06", title: "Standalone Development", desc: "Worked in an isolated Vite project — no repo cloning, no login dependencies. 30-second setup vs 30-minute traditional flow." },
    { n: "07", title: "Validation & Handoff", desc: "Confirmed 90%+ coverage. All interactions tested, accessibility checked, documentation updated. Handoff-ready." },
  ];

  return (
    <div className="cs1-si bd-si-process">
      <div className="cs1-slide-label">02 · Process</div>
      <h2 className="cs1-slide-h">From vibe-coded sketch<br />to production dashboard.</h2>
      <p className="cs1-slide-p">
        The migration wasn&apos;t a single step — it was a 7-phase journey that combined
        automated tooling with conversational refinement. Each phase had a specific goal,
        and the standalone approach kept the feedback loop instant throughout.
      </p>

      <div className="bd-callout">
        <span className="bd-callout-label">Key Insight</span>
        Working in an isolated project eliminated environment friction entirely — 30-second setup,
        instant dev server, 100% focus on the migration work. No repo cloning. No login flows.
      </div>

      <div className="bd-phase-row">
        {phases.map((p) => (
          <div className="bd-phase-item" key={p.n}>
            <div className="bd-phase-num">{p.n}</div>
            <div className="bd-phase-content">
              <div className="bd-phase-title">{p.title}</div>
              <div className="bd-phase-desc">{p.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bd-screenshot-wrap">
        <img src="/cs-blade/02-phase1.png" alt="Claude Design to React phase" className="bd-screenshot" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Slide 2 — Methods
───────────────────────────────────────────────────────── */

function SlideMethods() {
  return (
    <div className="cs1-si bd-si-methods">
      <div className="cs1-slide-label">03 · Refinement methods</div>
      <h2 className="cs1-slide-h">Five ways to fix<br />what automation misses.</h2>
      <p className="cs1-slide-p">
        Automated migration covers the obvious conversions. The hard part is the 35–40% that
        needs human judgment — custom interactions, edge cases, and components that don&apos;t
        have a direct Blade equivalent. These are the tools I used.
      </p>

      <div className="bd-method-grid">
        <div className="bd-method-card">
          <img src="/cs-blade/04-agentation.png" alt="Agentation visual bug tracking" className="bd-method-img" />
          <div className="bd-method-body">
            <div className="bd-method-num">Method 01</div>
            <div className="bd-method-title">Agentation</div>
            <div className="bd-method-desc">
              Tag issues directly on localhost. Click broken elements, add comments, export
              as structured feedback — Claude fixes all tagged issues in one pass.
            </div>
          </div>
        </div>

        <div className="bd-method-card">
          <img src="/cs-blade/05-snip.png" alt="Snip Chrome extension" className="bd-method-img" />
          <div className="bd-method-body">
            <div className="bd-method-num">Method 02</div>
            <div className="bd-method-title">Snip Extension</div>
            <div className="bd-method-desc">
              Chrome extension that captures element divs with styling info.
              Navigate to the problem, capture with Snip, share the link with Claude.
            </div>
          </div>
        </div>

        <div className="bd-method-card">
          <img src="/cs-blade/06-plan-mode.png" alt="Plan Mode checklist" className="bd-method-img" />
          <div className="bd-method-body">
            <div className="bd-method-num">Method 03</div>
            <div className="bd-method-title">Plan Mode + Wispr</div>
            <div className="bd-method-desc">
              Voice-dictate a full list of issues via Wispr — Claude formats as a checklist
              and works through every item while you do other work.
            </div>
          </div>
        </div>

        <div className="bd-method-card bd-method-card--text">
          <div className="bd-method-body bd-method-body--full">
            <div className="bd-method-num">Methods 04 &amp; 05</div>
            <div className="bd-method-title">Screenshots + Component References</div>
            <div className="bd-method-desc">
              Share a screenshot with context for quick visual fixes. For component selection,
              provide Storybook links, Figma screenshots, or existing examples to guide Claude
              toward the right Blade component.
            </div>
            <div className="bd-method-tip">
              <span className="bd-tip-label">Golden rule</span>
              When a Blade component doesn&apos;t exist, build custom — but use Blade tokens
              to stay compliant.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Slide 3 — Coverage
───────────────────────────────────────────────────────── */

function SlideCoverage() {
  const phases = [
    { label: "After automated migration", pct: 63, color: "#f59e0b", note: "Auto-converted layout, typography, basic interactive elements" },
    { label: "After manual refinement",   pct: 82, color: "#3b82f6", note: "Fixed custom dropdowns, navigation, filter components" },
    { label: "After complex fixes",       pct: 92, color: "#22c55e", note: "Rebuilt FilterPopover, SplitByDropdown, chart colors" },
  ];

  return (
    <div className="cs1-si bd-si-coverage">
      <div className="cs1-slide-label">04 · Coverage analysis</div>
      <h2 className="cs1-slide-h">Tracking every component.<br />Targeting 90%+.</h2>
      <p className="cs1-slide-p">
        Coverage reports turned a fuzzy sense of &quot;how compliant is this?&quot; into a
        concrete roadmap. Each phase had a score, a list of easy wins, and a list of
        complex fixes — giving a clear sense of effort vs. impact.
      </p>

      <div className="bd-coverage-stages">
        {phases.map((p, i) => (
          <div className="bd-coverage-stage" key={i}>
            <div className="bd-coverage-stage-header">
              <span className="bd-coverage-stage-label">{p.label}</span>
              <span className="bd-coverage-pct" style={{ color: p.color }}>{p.pct}%</span>
            </div>
            <div className="bd-coverage-bar">
              <div className="bd-coverage-bar-fill" style={{ width: `${p.pct}%`, background: p.color }} />
            </div>
            <div className="bd-coverage-note">{p.note}</div>
          </div>
        ))}
      </div>

      <div className="bd-screenshot-row">
        <img src="/cs-blade/07-coverage.png" alt="Coverage report" className="bd-screenshot-half" />
        <img src="/cs-blade/08-coverage2.png" alt="Coverage report 2" className="bd-screenshot-half" />
      </div>

      <div className="bd-coverage-breakdown">
        <div className="cs1-slide-label" style={{ marginTop: 28 }}>What the report covers</div>
        <div className="bd-coverage-items">
          {[
            { label: "Overall Score",       detail: "Single % across all component files" },
            { label: "Per-file breakdown",  detail: "Coverage % and specific issues per component" },
            { label: "Easy wins",           detail: "Button swaps, color tokens, icon replacements" },
            { label: "Complex fixes",       detail: "Custom dropdowns, portal overlays, chart configs" },
            { label: "Roadmap phases",      detail: "Phased effort estimate with projected score jumps" },
          ].map((item, i) => (
            <div className="bd-coverage-item" key={i}>
              <span className="bd-coverage-item-label">{item.label}</span>
              <span className="bd-coverage-item-detail">{item.detail}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Slide 4 — Challenges
───────────────────────────────────────────────────────── */

function SlideChallenges() {
  const themes = [
    {
      icon: "⚡",
      n: "01",
      title: "Working Within Design System Constraints",
      challenge: "Blade's Box component can't become interactive elements like buttons — intentional for accessibility.",
      solution: "Used native HTML elements for interaction while keeping Blade tokens for visual consistency.",
      takeaway: "Design systems guide toward accessible patterns. Working with constraints leads to better UX.",
    },
    {
      icon: "🎨",
      n: "02",
      title: "Translating Design to Tokens",
      challenge: "Custom colors, spacing, and values didn't always have a direct Blade token equivalent.",
      solution: "Created clear mappings, choosing the nearest semantic token over one-off custom values.",
      takeaway: "System adoption is about systematic thinking — not pixel-perfect replication.",
    },
    {
      icon: "🔧",
      n: "03",
      title: "Building Interactive Experiences",
      challenge: "Multi-select filters, dimension pickers, and grouped dropdowns needed behavior Blade doesn't provide out-of-the-box.",
      solution: "Built custom components using Blade primitives (Box, Text, Icons) with portal pattern for overlays.",
      takeaway: "Use building blocks consistently — visual language stays unified even when interactions are unique.",
    },
    {
      icon: "📊",
      n: "04",
      title: "Charts & Data Visualization",
      challenge: "Visualization components needed explicit sizing, specific data shapes, and aligned color tokens.",
      solution: "Established clear container structures with explicit heights, transformed data to chart expectations, used Blade data color tokens.",
      takeaway: "Data viz components are powerful but particular. Understand their requirements upfront.",
    },
    {
      icon: "🔒",
      n: "05",
      title: "Type Safety During Migration",
      challenge: "Dynamic data transformations — API responses to chart data to table displays — needed clear typing.",
      solution: "Defined TypeScript interfaces for each data structure, making data flow explicit throughout the app.",
      takeaway: "Type safety is documentation. Especially important when components have specific prop expectations.",
    },
  ];

  return (
    <div className="cs1-si bd-si-challenges">
      <div className="cs1-slide-label">05 · Challenges</div>
      <h2 className="cs1-slide-h">Five themes. Real friction.<br />Concrete solutions.</h2>
      <p className="cs1-slide-p">
        Migration revealed patterns that go beyond this project. Each challenge became a
        framework for thinking — not just a fix, but a principle for future Blade work.
      </p>

      <div className="bd-challenge-list">
        {themes.map((t, i) => (
          <div className="bd-challenge-item" key={i}>
            <div className="bd-challenge-header">
              <span className="bd-challenge-icon">{t.icon}</span>
              <span className="bd-challenge-n">0{i + 1}</span>
              <span className="bd-challenge-title">{t.title}</span>
            </div>
            <div className="bd-challenge-body">
              <div className="bd-challenge-row">
                <span className="bd-cl-badge bd-cl-badge--problem">Challenge</span>
                <span className="bd-cl-text">{t.challenge}</span>
              </div>
              <div className="bd-challenge-row">
                <span className="bd-cl-badge bd-cl-badge--solution">Solution</span>
                <span className="bd-cl-text">{t.solution}</span>
              </div>
              <div className="bd-challenge-takeaway">→ {t.takeaway}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Slide 5 — Outcome
───────────────────────────────────────────────────────── */

function SlideOutcome() {
  const components = [
    "GlobalNav", "PrimaryStrip", "SecondarySidebar",
    "ChartCard", "LineChart", "TableView",
    "ChartConfig", "FilterPopover",
  ];

  return (
    <div className="cs1-si bd-si-outcome">
      <div className="cs1-slide-label">06 · Outcome</div>
      <h2 className="cs1-slide-h">A production-ready dashboard.<br />8 reusable components.</h2>

      <div className="bd-screenshot-wrap">
        <img src="/cs-blade/10-final.png" alt="Final Optimizer Dashboard" className="bd-screenshot" />
      </div>

      <div className="cs1-slide-label" style={{ marginTop: 32 }}>Component library</div>
      <div className="bd-component-chips">
        {components.map((c) => (
          <span className="bd-component-chip" key={c}>{c}</span>
        ))}
      </div>

      <div className="rc-impact-grid" style={{ marginTop: 32 }}>
        {[
          { stat: "92%",    label: "Blade compliance achieved" },
          { stat: "7",      label: "phased migration process" },
          { stat: "30 sec", label: "project setup vs 30 min" },
          { stat: "8",      label: "production-ready components" },
        ].map((s, i) => (
          <div className="rc-impact-card" key={i}>
            <div className="rc-impact-stat">{s.stat}</div>
            <div className="rc-impact-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="cs1-slide-label" style={{ marginTop: 32 }}>Key learnings</div>
      <div className="rc-learnings">
        {[
          { title: "Phased migration beats big-bang rewrites", body: "Automated first, then manual — each phase had a clear deliverable. Progress was visible, never abstract." },
          { title: "Standalone projects eliminate setup drag", body: "Removing environment friction isn't just a convenience. It fundamentally changes the feedback loop and the quality of work." },
          { title: "Coverage reports create accountability", body: "Tracking a score turns compliance from a vague goal into a concrete task list. Easy wins first, then complexity." },
          { title: "Design system constraints are features", body: "Every time Blade said no, it was protecting accessibility or consistency. Fighting constraints was the wrong instinct." },
        ].map((l, i) => (
          <div className="rc-learning-row" key={i}>
            <div className="rc-learning-title">{l.title}</div>
            <div className="rc-learning-text">{l.body}</div>
          </div>
        ))}
      </div>

      <div className="rc-closing" style={{ marginTop: 40 }}>
        <div className="rc-closing-line">Design systems reward patience.</div>
        <p className="rc-closing-sub">
          The Optimizer Dashboard isn&apos;t just Blade-compliant — it&apos;s maintainable,
          accessible, and aligned with how Razorpay builds product. The process is the point.
        </p>
      </div>
    </div>
  );
}
