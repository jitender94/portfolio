"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SurfaceSlideshow from "./SurfaceSlideshow";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

/* ─── 38 slides: two-journey structure with all mockups ───
   Research section now has TWO experience slides:
     - slide 9:  "Back to the Bluestone story" (Akash panicked + 3 tabs)
     - slide 10: "Current Experience Detail" (3-step dashboard navigation + screenshots)
   All slide indices from 10 onward shifted down by 1 compared to the original 37-slide map. */
const SLIDES = [
  "Overview",                   // 0  — cover
  "Context",                    // 1  — HERO
  "The Merchant's Story",       // 2
  "Why It Matters",             // 3
  "What is a Downtime?",        // 4
  "Problem",                    // 5  — HERO
  "Business Problems",          // 6
  "User Problems",              // 7
  "Research",                   // 8  — HERO
  "Current Experience",         // 9  — Bluestone story (Akash + 3 tabs)
  "Current Experience Detail",  // 10 — NEW: 3-step dashboard navigation + screenshots
  "Data & Attribution",         // 11
  "Design Problem Statement",   // 12 — HERO
  "Problem Statements",         // 13
  "Vision & Outcomes",          // 14
  "Design",                     // 15 — HERO
  "Iterations",                 // 16
  "Usability Testing",          // 17
  "Solution",                   // 18 — HERO
  "Final Designs",              // 19 — Section intro
  "Dashboard Journey",          // 20 — Journey 1 intro + video
  "Dashboard Screen 1",         // 21
  "Dashboard Screen 2",         // 22
  "Dashboard Screen 3",         // 23
  "Dashboard Screen 4",         // 24
  "Dashboard Screen 5",         // 25
  "Dashboard Screen 6",         // 26
  "Email Journey",              // 27 — Journey 2 header
  "Email Journey Video",        // 28 — Email journey video
  "Email Screen 1",             // 29
  "Email Screen 2",             // 30
  "Email Screen 3",             // 31
  "Email Screen 4",             // 32
  "Email Screen 5",             // 33
  "Email Screen 6",             // 34
  "Email Screen 7",             // 35
  "Email Screen 8",             // 36
  "Results & Learnings",        // 37
];

/* Hero slides get a diamond dot in the footer (shifted by +1 after slide 10 insert). */
const HERO_SLIDES = new Set([1, 5, 8, 12, 15, 18]);

/* Footer section groups (Research range extended; everything after shifted by +1). */
const SECTIONS = [
  { label: "Intro",      range: [0, 0]   as [number, number] },
  { label: "Context",    range: [1, 4]   as [number, number] },
  { label: "Problem",    range: [5, 7]   as [number, number] },
  { label: "Research",   range: [8, 11]  as [number, number] },
  { label: "Synthesis",  range: [12, 14] as [number, number] },
  { label: "Design",     range: [15, 17] as [number, number] },
  { label: "Solution",   range: [18, 36] as [number, number] },
  { label: "Results",    range: [37, 37] as [number, number] },
];

export default function CaseStudy1({ isOpen, onClose }: Props) {
  const [slide, setSlide] = useState(0);
  const slideIdxRef = useRef(0);                              // sync ref avoids stale closures
  const stageRef    = useRef<HTMLDivElement>(null);
  const slideRefs   = useRef<(HTMLDivElement | null)[]>([]);  // one ref per slide

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
    if (isOpen) window.history.pushState({ overlay: "cs1" }, "");
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

  const go   = useCallback((d: number) => {
    const next = Math.max(0, Math.min(SLIDES.length - 1, slideIdxRef.current + d));
    scrollToSlide(next);
  }, [scrollToSlide]);

  const goTo = useCallback((idx: number) => scrollToSlide(idx), [scrollToSlide]);

  /* Keyboard navigation */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")                                  { onClose(); return; }
      if (e.key === "ArrowDown" || e.key === "ArrowRight")       go(1);
      if (e.key === "ArrowUp"   || e.key === "ArrowLeft")        go(-1);
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="overlay cs1-pres"
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
              <div className="cs1-ph-title">Ecosystem health, downtimes &amp; alerting</div>
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
                className="cs1-slide"
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

          {/* ── Footer — section-grouped navigation ── */}
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
   Slide routing — 38 slides with complete journey mockups
───────────────────────────────────────────────────────── */

function SlideContent({ index }: { index: number }) {
  switch (index) {
    case  0: return <SlideOverview />;
    case  1: return <SlideHeroContext />;
    case  2: return <SlideMerchantStory />;
    case  3: return <SlideWhyMatters />;
    case  4: return <SlideWhatIsDowntime />;
    case  5: return <SlideHeroProblem />;
    case  6: return <SlideBizProblems />;
    case  7: return <SlideUserProblems />;
    case  8: return <SlideHeroResearch />;
    case  9: return <SlideCurrentExp />;
    case 10: return <SlideCurrentExpDetail />;
    case 11: return <SlideDataAttribution />;
    case 12: return <SlideHeroDesignProblem />;
    case 13: return <SlideHMW />;
    case 14: return <SlideVision />;
    case 15: return <SlideHeroDesign />;
    case 16: return <SlideIterations />;
    case 17: return <SlideTesting />;
    case 18: return <SlideHeroSolution />;
    case 19: return <SlideFinalDesignsHeader />;
    case 20: return <SlideDashboardJourneyIntro />;
    case 21: return <SlideDashboardScreen screen={1} />;
    case 22: return <SlideDashboardScreen screen={2} />;
    case 23: return <SlideDashboardScreen screen={3} />;
    case 24: return <SlideDashboardScreen screen={4} />;
    case 25: return <SlideDashboardScreen screen={5} />;
    case 26: return <SlideDashboardScreen screen={6} />;
    case 27: return <SlideEmailJourneyHeader />;
    case 28: return <SlideEmailJourneyIntro />;
    case 29: return <SlideEmailScreen screen={1} />;
    case 30: return <SlideEmailScreen screen={2} />;
    case 31: return <SlideEmailScreen screen={3} />;
    case 32: return <SlideEmailScreen screen={4} />;
    case 33: return <SlideEmailScreen screen={5} />;
    case 34: return <SlideEmailScreen screen={6} />;
    case 35: return <SlideEmailScreen screen={7} />;
    case 36: return <SlideEmailScreen screen={8} />;
    case 37: return <SlideOutcome />;
    default: return null;
  }
}

/* ─────────────────────────────────────────────────────────
   Section hero helper — shared layout for all 5 chapter breaks
───────────────────────────────────────────────────────── */

function SectionHero({
  num,
  title,
  sub,
  illustration,
}: {
  num: string;
  title: string;
  sub: string;
  illustration?: string;
}) {
  return (
    <div className="cs1-si cs1-si--hero">
      <div className="cs1-hero-ghost" aria-hidden="true">{num}</div>
      {/* Order: section label → illustration → title → subtext */}
      <div className="cs1-hero-eyebrow">Section {num}</div>
      <div className="cs1-hero-rule" />
      {illustration && (
        <img
          className="cs1-hero-illustration"
          src={illustration}
          alt=""
          aria-hidden="true"
        />
      )}
      <h2 className="cs1-hero-title">{title}</h2>
      <p className="cs1-hero-sub">{sub}</p>
    </div>
  );
}

/* ── Section heroes ── */

function SlideHeroContext() {
  return (
    <SectionHero
      num="01"
      title="Context"
      sub="The merchant's reality, how the payment ecosystem works, and what a downtime actually means for a business."
      illustration="/cs1/Context.png"
    />
  );
}

function SlideHeroProblem() {
  return (
    <SectionHero
      num="02"
      title="Problem"
      sub="Five business gaps and two user pain points surfaced with product, business, and merchant support data."
      illustration="/cs1/BusinessProblem.png"
    />
  );
}

function SlideHeroResearch() {
  return (
    <SectionHero
      num="03"
      title="Research"
      sub="Three dead ends in the current dashboard, 17,000+ tickets, and the reframe that changed the entire direction — from alerting to attribution."
      illustration="/cs1/Research.png"
    />
  );
}

function SlideHeroDesign() {
  return (
    <SectionHero
      num="05"
      title="Design"
      sub="Four iteration rounds with Lovable and Figma Make, two concepts killed, one idea no competitor had built."
      illustration="/cs1/Design.png"
    />
  );
}

function SlideHeroDesignProblem() {
  return (
    <SectionHero
      num="04"
      title="Design Problem Statement"
      sub="Four How Might We questions and a north-star vision — the synthesis that turned research into a design direction."
      illustration="/cs1/DesignProbStatement.png"
    />
  );
}

function SlideHeroSolution() {
  return (
    <SectionHero
      num="06"
      title="Solution"
      sub="Three surfaces. One coherent system. Merchants go from panic to decision in under two minutes."
      illustration="/cs1/Design.png"
    />
  );
}

/* ─────────────────────────────────────────────────────────
   Content slides — all 15 original slides
───────────────────────────────────────────────────────── */

/* ── Slide 0 — Overview / Cover ── */
function SlideOverview() {
  return (
    <div className="cs1-si cs1-si--cover">
      {/* Two-column: title + hook left / mockup right */}
      <div className="cs1-cover-hero-grid">
        <div className="cs1-cover-left">
          <h1 className="cs1-cover-h">
            Ecosystem health,<br /><em>downtimes &amp; alerting</em>
          </h1>
          <p className="cs1-cover-hook">
            When payment <strong>failures spike</strong>, <strong>merchants panic</strong>.{" "}
            They <strong>escalate to POCs</strong>/Support and <strong>wait 6+&nbsp;hours</strong>{" "}
            in anxiety&mdash;wondering <strong>what is broken</strong> &ndash; Is it Razorpay or issuer banks or network.
          </p>
          <p className="cs1-cover-hook" style={{ marginBottom: 0 }}>
            We receive <strong>17K+</strong> such <strong>tickets</strong> annually. Meanwhile,
            merchants can&apos;t decide next action without issue isolation.
          </p>
        </div>
        <div className="cs1-cover-right">
          <img
            src="/cs1/hero_image.png"
            alt="Ecosystem Health Dashboard — downtime detail view"
            className="cs1-cover-img"
          />
        </div>
      </div>

      {/* Meta row: role / timeline / reach / platform */}
      <div className="cs1-meta">
        {[
          ["Role",     "Lead Product Designer"],
          ["Timeline", "May – Nov 2025"],
          ["Reach",    "3,900+ merchants"],
          ["Platform", "Web"],
        ].map(([label, val]) => (
          <div className="cs1-meta-cell" key={label}>
            <div className="cs1-meta-label">{label}</div>
            <div className="cs1-meta-val">{val}</div>
          </div>
        ))}
      </div>

      {/* Outcomes row: results upfront */}
      <div className="cs1-cover-outcomes">
        {[
          ["30–40%",  "Reduction in payment-failure support tickets"],
          ["< 5 min", "Time-to-diagnosis, down from 6+ hours"],
          ["3,900+",  "MM + Enterprise merchants reached at launch"],
        ].map(([num, label]) => (
          <div className="cs1-cover-outcome-cell" key={num}>
            <div className="cs1-cover-outcome-n">{num}</div>
            <div className="cs1-cover-outcome-l">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Slide 2 — The Merchant's Story ── */
function SlideMerchantStory() {
  return (
    <div className="cs1-si">
      <div className="cs1-slide-label">Context &middot; 01</div>
      <h2 className="cs1-slide-h">Imagine this.</h2>

      {/* Scene — callout block */}
      <div className="cs1-highlight" style={{ marginBottom: 0 }}>
        <div className="cs1-highlight-label">The Scene</div>
        <p>Akash, Product Manager at Bluestone.com, opens his laptop with morning coffee. His analytics dashboard loads — and something immediately catches his eye.</p>
      </div>

      {/* What the dashboard shows — alert stat block */}
      <div className="cs1-alert-stat">
        <div className="cs1-alert-stat-body">
          <div className="cs1-alert-stat-label">What the dashboard shows</div>
          <div className="cs1-alert-stat-row">
            <span className="cs1-alert-stat-n">23.4%</span>
            <span className="cs1-alert-stat-title">Payment failure rate</span>
            <span className="cs1-alert-stat-badge">↑ 8.2% from baseline</span>
          </div>
        </div>
      </div>

      {/* Story pivot */}
      <div className="cs1-story-pivot">His stomach drops.</div>

      {/* Context stats — reuse existing stat grid */}
      <div className="cs1-stat-grid" style={{ marginBottom: 0 }}>
        <div className="cs1-stat">
          <div className="cs1-stat-n">₹15K–50K</div>
          <div className="cs1-stat-l">Avg. Order Value — high-value jewellery at stake</div>
        </div>
        <div className="cs1-stat">
          <div className="cs1-stat-n">₹1,200</div>
          <div className="cs1-stat-l">Customer acquisition cost per order via Instagram ads</div>
        </div>
      </div>
    </div>
  );
}

/* ── Slide 3 — Why It Matters ── */
function SlideWhyMatters() {
  return (
    <div className="cs1-si">
      <div className="cs1-slide-label">Context &middot; 02</div>
      <h2 className="cs1-slide-h">Why this matters<br />to Bluestone.</h2>

      {/* 4 reasons — reuse cs1-dirs pattern with emoji icon in the letter cell */}
      <div className="cs1-dirs" style={{ marginTop: 28 }}>
        {[
          { icon: "💸", title: "High revenue at stake",        desc: "AOV of ₹15K–50K means every failed payment is a significant revenue hit — not a rounding error." },
          { icon: "📢", title: "Campaign actively running",    desc: "A wedding season campaign is live with heavy Instagram ad spend. Every checkout failure burns paid traffic." },
          { icon: "🎧", title: "Support already overwhelmed",  desc: "Customer complaints are trickling into WhatsApp support. Escalations mounting with no resolution path." },
          { icon: "🔍", title: "No diagnostic clarity",        desc: "No clarity on why failures spiked — is it Razorpay, the bank, or their integration? No product to tell them." },
        ].map(({ icon, title, desc }) => (
          <div className="cs1-dir cs1-dir--chosen" key={title}>
            <div className="cs1-dir-letter cs1-dir-letter--icon">{icon}</div>
            <div className="cs1-dir-body">
              <div className="cs1-dir-title">{title}</div>
              <div className="cs1-dir-desc" style={{ marginBottom: 0 }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>

      <blockquote className="cs1-bq cs1-bq--featured" style={{ marginTop: 24 }}>
        <p>&ldquo;Every failed payment is a potential lost customer — and the cost was already paid to bring them here.&rdquo;</p>
        <cite>Akash, PM at Bluestone.com</cite>
      </blockquote>
    </div>
  );
}

/* ── Slide 3 — What is a Downtime? ── */
function SlideWhatIsDowntime() {
  return (
    <div className="cs1-si">
      <div className="cs1-slide-label">Context &middot; 03</div>
      <h2 className="cs1-slide-h">Before we go further —<br />what is a payment downtime?</h2>
      <div className="cs1-north-star" style={{ marginBottom: 28 }}>
        <div className="cs1-ns-label">Definition</div>
        <div className="cs1-ns-text">A downtime is the period during which a system — a bank, card network, or UPI provider — is unavailable or not processing requests.</div>
      </div>
      {/* Payment ecosystem diagram is an illustration, NOT a web mockup — render
          without browser chrome (no traffic dots, no counter). Caption kept. */}
      <SurfaceSlideshow
        tag="The payment ecosystem — Buyer → Razorpay → Banks / Networks → Seller"
        slides={["/cs1/s08.png"]}
        bare
      />
      <p className="cs1-slide-p" style={{ marginTop: 20 }}>Payment ecosystems are interconnected networks: your website connects to Razorpay&rsquo;s gateway, which routes through acquirer banks, card networks (Visa, Mastercard, Amex), and issuer banks. When any one node fails, transactions fail — even if your integration and Razorpay&rsquo;s systems are perfectly healthy.</p>
      <div className="cs1-dirs" style={{ marginTop: 24 }}>
        {[
          { letter: "1", title: "Bank downtime", desc: "HDFC, ICICI, Axis server issues affecting net banking or UPI collect. Resolution time: ~60 minutes on average." },
          { letter: "2", title: "Card network downtime", desc: "Amex, Mastercard, Visa infrastructure issues. Affects all cards on that network, regardless of issuer. Cannot be bypassed by Razorpay." },
          { letter: "3", title: "UPI downtime", desc: "NPCI or VPA resolution issues. Impacts UPI Pay, UPI Collect, and AutoPay mandate registrations." },
        ].map(({ letter, title, desc }) => (
          <div className="cs1-dir cs1-dir--chosen" key={letter}>
            <div className="cs1-dir-letter">{letter}</div>
            <div className="cs1-dir-body">
              <div className="cs1-dir-title">{title}</div>
              <div className="cs1-dir-desc">{desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="cs1-highlight" style={{ marginTop: 24 }}>
        <div className="cs1-highlight-label">Why can&rsquo;t Razorpay fix this?</div>
        <p>Think of the card network as a bridge connecting all banks. When the bridge has issues, no one can cross — regardless of which bank they&rsquo;re coming from or going to. Razorpay can reroute traffic to backup terminals, but it can&rsquo;t fix the underlying infrastructure. And critically, <strong>merchants never saw any of this happening</strong>.</p>
      </div>
    </div>
  );
}

/* ── Slide 5 — Business Problems ── */
function SlideBizProblems() {
  return (
    <div className="cs1-si">
      <div className="cs1-slide-label">Problem &middot; 01</div>
      <h2 className="cs1-slide-h">Problems identified with<br />product &amp; business teams</h2>
      <div className="cs1-dirs" style={{ marginTop: 28 }}>
        {[
          { n: "01", title: "Invisible Value",   desc: "Merchants overlook Razorpay's backup routing and intelligent rerouting, missing the platform intelligence being applied on their behalf." },
          { n: "02", title: "SR Perception Gap", desc: "Without context for why SR drops during downtimes, Razorpay appears to underperform compared to orchestrators like Juspay — a false impression." },
          { n: "03", title: "Manual GTM Motion", desc: "KAMs and analysts still share SR and downtime insights manually via PDFs and Slack, with no self-serve visibility for merchants." },
          { n: "04", title: "High Support Load", desc: "Downtime-related issues drive merchant escalations, support dependency, and engineering war rooms — with no self-serve resolution path." },
          { n: "05", title: "Churn Risk",         desc: "Competing platforms bundle observability + routing together, making Razorpay feel less integrated and less intelligent." },
        ].map(({ n, title, desc }) => (
          <div className="cs1-dir cs1-dir--killed" key={n} style={{ opacity: 1 }}>
            {/* Number badge — bolder + higher contrast (was 11px opacity 0.5).
                Stays compact but reads clearly against the killed-card bg. */}
            <div className="cs1-dir-letter" style={{ fontSize: 14, fontWeight: 700, opacity: 1, color: "var(--cs-text)" }}>{n}</div>
            <div className="cs1-dir-body">
              <div className="cs1-dir-title">{title}</div>
              <div className="cs1-dir-desc">{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Slide 6 — User Problems ── */
function SlideUserProblems() {
  return (
    <div className="cs1-si">
      <div className="cs1-slide-label">Problem &middot; 02</div>
      <h2 className="cs1-slide-h">User problems surface<br />from merchant feedback</h2>
      <div className="cs1-dirs" style={{ marginTop: 28, marginBottom: 0 }}>
        {[
          {
            n: "01",
            title: "The cost of invisible downtime",
            desc: "Merchants face revenue loss, poor customer experience, and support overhead due to limited or delayed visibility into downtimes affecting Razorpay's payment infrastructure. They can't take corrective action because they don't know what's causing the failure.",
          },
          {
            n: "02",
            title: "Gaps in today's downtime communication",
            desc: "The current system offers limited real-time insights and disjointed alerting, with no merchant-specific impact view. Downtime communication lacks clarity, speed, and actionable context. Merchants receive a generic status page — not a \"here's what's happening to your payments\" view.",
          },
        ].map(({ n, title, desc }) => (
          <div className="cs1-dir cs1-dir--killed" key={n} style={{ opacity: 1 }}>
            {/* Bolder number badge for clearer reading (was 11px opacity 0.5). */}
            <div className="cs1-dir-letter" style={{ fontSize: 14, fontWeight: 700, opacity: 1, color: "var(--cs-text)" }}>{n}</div>
            <div className="cs1-dir-body">
              <div className="cs1-dir-title">{title}</div>
              <div className="cs1-dir-desc">{desc}</div>
            </div>
          </div>
        ))}
      </div>
      {/* Support-data stats (6+ hrs, ₹80K/day, War room, No path) were here.
          Moved to SlideDataAttribution in the Research section. */}
    </div>
  );
}

/* ── Slide 8 — Current Experience — content matches Figma slide:
   "Back to the Bluestone story" → Akash panicked → opens 3 tabs simultaneously. ── */
function SlideCurrentExp() {
  return (
    <div className="cs1-si">
      {/* Blue-accent callback label, matches Figma's 👉 BACK TO THE BLUESTONE STORY */}
      <div
        className="cs1-slide-label"
        style={{ color: "var(--cs-accent)", fontWeight: 600 }}
      >
        👉 Back to the Bluestone story
      </div>
      <h2 className="cs1-slide-h">
        Akash is panicked after seeing the failure rate.<br />
        <em style={{ fontStyle: "normal", fontWeight: 400, color: "var(--cs-dim)" }}>
          His first instinct: &ldquo;Is this us or Razorpay?&rdquo;
        </em>
      </h2>

      {/* Research insight — was a plain paragraph, now elevated to a north-star
          callout with a tight one-liner so it reads as a takeaway, not narration. */}
      <div className="cs1-north-star" style={{ marginTop: 28 }}>
        <div className="cs1-ns-label">Research insight</div>
        <div className="cs1-ns-text">
          Merchants take revenue hits and absorb support overhead because they can&rsquo;t see what&rsquo;s actually breaking — and can&rsquo;t act on what they can&rsquo;t see.
        </div>
      </div>

      {/* "He opens three tabs simultaneously" — no border/box now. Minimal
          cursor-click icon on the left, label + bullets on the right. */}
      <div style={{ marginTop: 32, display: "flex", alignItems: "flex-start", gap: 14 }}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          style={{ flexShrink: 0, marginTop: 2, color: "var(--cs-accent)" }}
        >
          {/* MousePointerClick — cursor arrow with motion ticks */}
          <path d="M9 9l5 12 1.6-5.4L21 14L9 9z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M3 3l2 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M3 8l2-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
          <path d="M8 3l-2 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
        </svg>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--cs-text)",
              marginBottom: 12,
              letterSpacing: 0.2,
            }}
          >
            He opens three tabs simultaneously
          </div>
          <ul
            style={{
              margin: 0,
              paddingLeft: 20,
              listStyle: "disc",
              color: "var(--cs-muted)",
              fontSize: 15.5,
              lineHeight: 1.8,
            }}
          >
            <li>
              <strong style={{ color: "var(--cs-text)" }}>Bluestone&rsquo;s internal monitoring</strong> &ndash; Integration logs look clean
            </li>
            <li>
              <strong style={{ color: "var(--cs-text)" }}>Razorpay Transactions Dashboard</strong> &ndash; To see the failure details
            </li>
            <li>
              <strong style={{ color: "var(--cs-text)" }}>Slack</strong> &ndash; To ping the tech team
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ── Slide 10 — Current Experience Detail — 3-view stepper carousel.
   Replaced the H2 + intro paragraph + SurfaceSlideshow + 3 stacked dirs with a
   single carousel: each view has its own mockup (or no mockup for the dead end)
   alongside the matching step text. Navigate with arrows or dots. ── */
function SlideCurrentExpDetail() {
  const views = [
    {
      n: "1",
      title: "Transactions main page",
      desc: "Akash reviews the transaction overview — total GMV and failed transactions. The numbers confirm something is wrong, but don't point to a cause. He digs deeper.",
      image: "/cs1/Current_1.png",
      killed: false,
    },
    {
      n: "2",
      title: "Failure detail page",
      desc: "He sees an overview of 4 buckets: Customer-related, Banking-related, Business-related, and Others. He can't see a primary root cause or actionable next step at a glance. The buckets are too broad.",
      image: "/cs1/Current_2.png",
      killed: false,
    },
    {
      n: "3",
      title: "Dead end",
      desc: "No attribution to any specific downtime. No indicator that Razorpay has already identified the issue. No ETA, no recommended action. He calls support — and waits 6+ hours.",
      image: null as string | null,
      killed: true,
    },
  ];

  const [active, setActive] = useState(0);
  const v = views[active];
  const prev = () => setActive((a) => (a - 1 + views.length) % views.length);
  const next = () => setActive((a) => (a + 1) % views.length);

  return (
    <div className="cs1-si">
      <div className="cs1-slide-label">Research &middot; 02</div>

      {/* Carousel viewport — NO outer border. Just the mockup (or centered
          dead-end text) flowing inline. Arrows sit OUTSIDE the mockup, in the
          card's padding zone, so they don't disturb the design. */}
      <div
        style={{
          marginTop: 8,
          position: "relative",
          minHeight: 480,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {v.image ? (
          <>
            {/* Image on top, full width, no border */}
            <img
              src={v.image}
              alt={v.title}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
            />
            {/* Step text below — tighter spacing between the number and the
                title/desc (was 60px col + 24px gap → now 32px col + 12px gap). */}
            <div
              style={{
                marginTop: 24,
                display: "grid",
                gridTemplateColumns: "32px 1fr",
                gap: 12,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "var(--cs-accent)",
                  lineHeight: 1,
                  fontFamily: "var(--display-font)",
                }}
              >
                {v.n}
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "var(--cs-text)", marginBottom: 8 }}>
                  {v.title}
                </div>
                <div style={{ fontSize: 15, color: "var(--cs-muted)", lineHeight: 1.7 }}>
                  {v.desc}
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Dead-end view — no image, content centered vertically + horizontally.
             Keeps the faded ghost "3" + light-grey panel for visual hierarchy. */
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "72px 32px",
              gap: 16,
              background: "var(--cs-bg2)",
              borderRadius: 8,
            }}
          >
            <div
              style={{
                fontSize: 56,
                fontWeight: 700,
                color: "var(--cs-dim)",
                lineHeight: 1,
                fontFamily: "var(--display-font)",
                opacity: 0.4,
              }}
            >
              {v.n}
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "var(--cs-text)" }}>
              {v.title}
            </div>
            <div
              style={{
                fontSize: 15,
                color: "var(--cs-muted)",
                lineHeight: 1.7,
                maxWidth: 560,
              }}
            >
              {v.desc}
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#c0392b",
              }}
            >
              ✕ End of current journey
            </div>
          </div>
        )}

        {/* Nav arrows — positioned OUTSIDE the mockup edges, sitting in the
            cs1-si's 64px horizontal padding. Negative offsets push them past the
            viewport bounds. */}
        <button
          onClick={prev}
          aria-label="Previous view"
          style={navArrowStyle("left")}
        >
          &larr;
        </button>
        <button
          onClick={next}
          aria-label="Next view"
          style={navArrowStyle("right")}
        >
          &rarr;
        </button>
      </div>

      {/* Dot indicator + counter below the viewport */}
      <div
        style={{
          marginTop: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}
      >
        {views.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`View ${i + 1}`}
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              border: "none",
              background: i === active ? "var(--cs-text)" : "var(--cs-border)",
              cursor: "pointer",
              padding: 0,
            }}
          />
        ))}
      </div>

      <div className="cs1-highlight" style={{ marginTop: 24 }}>
        <div className="cs1-highlight-label">The core failure</div>
        <p>
          The existing dashboard shows <strong>what</strong> failed (4 buckets), but never <strong>why</strong>. A merchant looking at &ldquo;30% Banking-related failures&rdquo; has no way to know if that&rsquo;s caused by an Axis UPI downtime, an HDFC server timeout, or a bug in their own integration.
        </p>
      </div>
    </div>
  );
}

/* Small helper — nav arrow positioning for SlideCurrentExpDetail.
   Arrows sit OUTSIDE the mockup edges in the cs1-si's 64px padding zone
   (negative offset of ~50px). Vertically centered on the mockup. */
function navArrowStyle(side: "left" | "right"): React.CSSProperties {
  return {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    [side]: -50,
    width: 36,
    height: 36,
    borderRadius: 999,
    border: "1px solid var(--cs-border)",
    background: "var(--cs-bg)",
    color: "var(--cs-text)",
    fontSize: 14,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    zIndex: 2,
  };
}

/* ── Slide 9 — Data & Attribution Gap ── */
function SlideDataAttribution() {
  return (
    <div className="cs1-si">
      <div className="cs1-slide-label">Research &middot; 02</div>
      <h2 className="cs1-slide-h">~1,900 tickets a month.<br />All asking the same question.</h2>
      <div className="cs1-stat-grid" style={{ marginBottom: 28 }}>
        {[
          ["17,000+",  "Support tickets annually from merchants asking \"why are my payments failing?\""],
          ["~1,900",   "Tickets per month — SR drops, latency spikes, OTP failures, capture issues"],
          ["5–10%",    "Of incidents proactively communicated by Razorpay. 90%+ were merchant-reported."],
          ["0",        "Tickets where the root cause was automatically attributed to a specific downtime"],
        ].map(([num, label]) => (
          <div className="cs1-stat" key={num}>
            <div className="cs1-stat-n">{num}</div>
            <div className="cs1-stat-l">{label}</div>
          </div>
        ))}
      </div>
      <SurfaceSlideshow
        tag="Attribution gap — failure RCA data + Slack escalation evidence"
        slides={["/cs1/s18.png", "/cs1/s19.png"]}
      />
      <div className="cs1-insight-trio" style={{ marginTop: 28 }}>
        {[
          { icon: "📉", text: "Merchants complain about frequent payment failures and low SR — even when Razorpay's SR is high by industry standards. They blame the gateway, not the bank." },
          { icon: "🤔", text: "Only a few merchants even knew the SR Dashboard existed. For those who did, it showed no clear error codes — no attribution, no merchant-specific impact." },
          { icon: "😰", text: "In the current day, merchants simply see 4 generic buckets: Customer-related, Banking-related, Business-related, Others. No root cause, no action path." },
        ].map(({ icon, text }) => (
          <div className="cs1-insight-col" key={icon}>
            <div className="cs1-insight-emoji">{icon}</div>
            <p className="cs1-insight-text">{text}</p>
          </div>
        ))}
      </div>

      {/* Support-data stats — moved here from User Problems slide.
          What this costs on the ground when a merchant escalates. */}
      <div className="cs1-slide-label" style={{ marginTop: 32, marginBottom: 12 }}>What this costs on the ground</div>
      <div className="cs1-stat-grid">
        {[
          ["6+ hrs",    "Typical wait for Razorpay RCA after merchant escalation"],
          ["₹80K/day",  "Marketing campaign pause cost while waiting for root cause"],
          ["War room",  "Engineering team pulled in every time a merchant escalated"],
          ["No path",   "Zero self-serve resolution flow for downtime queries"],
        ].map(([num, label]) => (
          <div className="cs1-stat" key={num}>
            <div className="cs1-stat-n">{num}</div>
            <div className="cs1-stat-l">{label}</div>
          </div>
        ))}
      </div>

      <div className="cs1-north-star" style={{ marginTop: 28 }}>
        <div className="cs1-ns-label">The critical insight</div>
        <div className="cs1-ns-text">Merchants don&rsquo;t think in &ldquo;downtimes&rdquo; — they think in <em>payment failures and SR drops</em>. In the current system, we cannot attribute a payment failure to a downtime occurring or that occurred.</div>
      </div>
      <div className="cs1-quotes" style={{ marginTop: 24 }}>
        <blockquote className="cs1-bq">
          <p>&ldquo;Why is latency of my payments higher right now?&rdquo;</p>
          <cite>Merchant ticket category #1</cite>
        </blockquote>
        <blockquote className="cs1-bq">
          <p>&ldquo;Why are my payments failing / not getting captured / OTP screen not appearing?&rdquo;</p>
          <cite>Merchant ticket category #2</cite>
        </blockquote>
      </div>
      <p className="cs1-slide-p cs1-slide-p--sm" style={{ marginTop: 20 }}>
        Only a few merchants even knew the Downtime Dashboard existed — and for those who did, it didn&rsquo;t connect to their transaction failures. The SR dashboard existed but showed no clear error codes, no attribution, and no merchant-specific impact view.
      </p>
    </div>
  );
}

/* ── Slide 10 — Problem Statements (HMW) ── */
function SlideHMW() {
  return (
    <div className="cs1-si">
      <div className="cs1-slide-label">Synthesis &middot; 01</div>
      <h2 className="cs1-slide-h">Four &ldquo;How Might We&rdquo; statements<br />defined after thorough research</h2>
      <div className="cs1-dirs" style={{ marginTop: 28 }}>
        {[
          { n: "HMW 1", q: "How might we increase visibility of downtimes to establish trust and reliability?",           note: "Addresses SR Perception Gap and Invisible Value" },
          { n: "HMW 2", q: "How might we reduce the operational overload and manual effort in downtime alerting?",        note: "Addresses Manual GTM Motion and High Support Load" },
          { n: "HMW 3", q: "How might we help merchants take appropriate actions during ongoing and planned downtimes?",   note: "Addresses The Cost of Invisible Downtime" },
          { n: "HMW 4", q: "How might we communicate the value Razorpay creates for merchants through backup routing?",   note: "Addresses Churn Risk and Invisible Value" },
        ].map(({ n, q, note }) => (
          <div className="cs1-dir cs1-dir--chosen" key={n}>
            <div className="cs1-dir-letter" style={{ fontSize: 9, letterSpacing: "0.1em", opacity: 0.6 }}>{n}</div>
            <div className="cs1-dir-body">
              <div className="cs1-dir-title" style={{ fontStyle: "italic", fontWeight: 500 }}>{q}</div>
              <div className="cs1-dir-desc">{note}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Slide 11 — Vision & Design Outcomes ── */
function SlideVision() {
  return (
    <div className="cs1-si">
      <div className="cs1-slide-label">Synthesis &middot; 02</div>
      <h2 className="cs1-slide-h">Make payment ecosystem<br />downtimes visible and actionable</h2>
      <div className="cs1-north-star" style={{ marginBottom: 28 }}>
        <div className="cs1-ns-label">Vision</div>
        <div className="cs1-ns-text">By making downtimes more visible, we avoid misinterpretation of payment failures, change the negative perception about Razorpay&rsquo;s SR, build trust and reliability, and enable merchants to take appropriate actions — and reconcile failures with downtimes for reporting.</div>
      </div>
      <div className="cs1-slide-label" style={{ marginBottom: 16 }}>Five design outcomes defined</div>
      <div className="cs1-dirs">
        {[
          { n: "01", outcome: "Provide real-time visibility into downtimes affecting a merchant's specific payment methods" },
          { n: "02", outcome: "Enable quick, informed action to manage customer experience, revenue impact, and ops" },
          { n: "03", outcome: "Build trust and transparency by proactively communicating platform issues before merchant escalation" },
          { n: "04", outcome: "Showcase Razorpay's value through backup routing, mitigation strategies, and recovery actions" },
          { n: "05", outcome: "Reduce dependence on manual alerting, support escalations, and engineering war rooms" },
        ].map(({ n, outcome }) => (
          <div className="cs1-dir cs1-dir--chosen" key={n}>
            <div className="cs1-dir-letter" style={{ fontSize: 11, opacity: 0.5 }}>{n}</div>
            <div className="cs1-dir-body">
              <div className="cs1-dir-desc" style={{ color: "var(--cs-text)", fontWeight: 500 }}>{outcome}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Slide 13 — Iterations ── */
function SlideIterations() {
  return (
    <div className="cs1-si">
      <div className="cs1-slide-label">Design &middot; 01</div>
      <h2 className="cs1-slide-h">Four rounds of iteration,<br />two AI tools, one concept no competitor had</h2>
      <div className="cs1-highlight" style={{ marginBottom: 28 }}>
        <div className="cs1-highlight-label">✨ AI-assisted iteration approach</div>
        <p>We used <strong>Lovable</strong> and <strong>Figma Make</strong> to build rapid prototypes before committing to Figma — enabling stakeholder alignment and early merchant testing without engineering cost. This let us explore ideas faster and get feedback on interactive prototypes in real stakeholder reviews.</p>
      </div>
      <div className="cs1-dirs">
        {[
          {
            letter: "v1",
            title: "Alert-first flow",
            desc: "Richer notification centre extending the downtime dashboard. Feedback: alerts and dashboards serve different moments — conflating them weakened both.",
            verdict: "✕  Killed — wrong mental model. Merchants don't go to alerts when SR drops.",
            killed: true,
          },
          {
            letter: "v2",
            title: "Standalone revamped dashboard",
            desc: "Better filters, personalisation, impact metrics. Key finding: merchants don't go to the Downtime Dashboard when SR drops — they go to Transactions.",
            verdict: "✕  Killed — requires habits merchants hadn't formed.",
            killed: true,
          },
          {
            letter: "v3",
            title: "Contextual injection",
            desc: "Bring the data to where merchants already are. Attribution in Transactions Dashboard. Overlays in InsightX. Inline tags in Support Chat. Approved by Co-founder and CPO.",
            verdict: "✓  Chosen — meets merchants in their moment of pain.",
            killed: false,
          },
          {
            letter: "v4",
            title: "Blueprint Visualizer + UI refinement",
            desc: "A live map of the merchant's unique terminal-method configuration with colour-coded health nodes, showing Razorpay rerouting traffic in real time. No competitor had this. Prototype tested with 5 merchants.",
            verdict: "✓  Final — usability tested and shipped.",
            killed: false,
          },
        ].map(({ letter, title, desc, verdict, killed }) => (
          <div className={`cs1-dir ${killed ? "cs1-dir--killed" : "cs1-dir--chosen"}`} key={letter}>
            <div className="cs1-dir-letter">{letter}</div>
            <div className="cs1-dir-body">
              <div className="cs1-dir-title">{title}</div>
              <div className="cs1-dir-desc">{desc}</div>
              <div className="cs1-dir-verdict">{verdict}</div>
            </div>
          </div>
        ))}
      </div>
      <SurfaceSlideshow
        tag="Iteration screens — AI prototypes + V1–V4 evolution"
        slides={["/cs1/s26.png", "/cs1/s28.png", "/cs1/s29.png"]}
      />
    </div>
  );
}

/* ── Slide 14 — Usability Testing ── */
function SlideTesting() {
  return (
    <div className="cs1-si">
      <div className="cs1-slide-label">Design &middot; 02</div>
      <h2 className="cs1-slide-h">Moderated sessions<br />across three merchant tiers</h2>
      <p className="cs1-slide-p">Tested the v4 prototype with 5 merchants from the SME and Mid-Market segment. Sessions were moderated and recorded via Marvin.</p>
      <div className="cs1-tiers">
        {[
          { tier: "Primary",   sessions: "4–5 sessions", title: "Funded Startups / EB",   desc: "Bluestone, Banksaathi, JaipurKurti. No TAM, self-diagnose entirely. Highest unmet need.", primary: true },
          { tier: "Secondary", sessions: "2–3 sessions", title: "Managed Mid-Market",      desc: "TAM-supported merchants. Testing whether dashboard reduces escalation load even when support exists.", primary: false },
          { tier: "Tertiary",  sessions: "1–2 sessions", title: "Enterprise",              desc: "Nykaa, Decathlon, Urban Company. Testing API/webhook integration preferences and sophisticated monitoring.", primary: false },
        ].map(({ tier, sessions, title, desc, primary }) => (
          <div className={`cs1-tier${primary ? " cs1-tier--primary" : ""}`} key={tier}>
            <div className="cs1-tier-badge">{tier} &middot; {sessions}</div>
            <div className="cs1-tier-title">{title}</div>
            <div className="cs1-tier-desc">{desc}</div>
          </div>
        ))}
      </div>
      <div className="cs1-highlight" style={{ marginTop: 24, marginBottom: 24 }}>
        <div className="cs1-highlight-label">Four consistent signals from testing</div>
        <p>
          <strong>Impact first</strong> — Need GMV loss &amp; failed transaction counts before any decision. &nbsp;
          <strong>Business recovery</strong> — Want to re-engage affected customers via retry emails/SMS. &nbsp;
          <strong>System integrations</strong> — APIs and webhooks rated higher than email alerts; Discord requested. &nbsp;
          <strong>Both current &amp; upcoming</strong> — Planned downtime calendar was the highest-rated new feature.
        </p>
      </div>
      <blockquote className="cs1-bq cs1-bq--featured">
        <p>&ldquo;Now it doesn&rsquo;t stop at seeing failures — I can immediately confirm if a downtime caused them, click through to see GMV and SR impact, or share downtime details with my team. This saves hours and lets us act quickly.&rdquo;</p>
        <cite>Ananya Sharma, Product Manager at Bluestone.com</cite>
      </blockquote>
      <SurfaceSlideshow
        tag="Before vs After — Transaction failure view redesign"
        slides={["/cs1/s27.png"]}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   FINAL DESIGNS — Two-journey structure
───────────────────────────────────────────────────────── */

/* ── Slide 18 — Final Designs Section Header ── */
function SlideFinalDesignsHeader() {
  return (
    <div className="cs1-si">
      <div className="cs1-slide-label">Solution &middot; Final Designs</div>
      <h2 className="cs1-slide-h">Two journeys.<br />Three surfaces.<br />One coherent system.</h2>
      <p className="cs1-slide-p">
        Merchants discover downtimes through two paths: proactively monitoring the dashboard, or reactively receiving an email alert. Both journeys converge on the same three core surfaces.
      </p>
      <div className="cs1-dirs" style={{ marginTop: 28 }}>
        {[
          {
            n: "01",
            title: "Dashboard Journey",
            desc: "Merchant proactively checks Ecosystem Health → sees live downtime status → clicks into detail page → reviews impact on Transactions Dashboard.",
          },
          {
            n: "02",
            title: "Email Journey",
            desc: "Merchant receives downtime alert email → clicks through to detail page → reviews impact and takes action → checks Transactions Dashboard for attribution.",
          },
        ].map(({ n, title, desc }) => (
          <div className="cs1-dir cs1-dir--chosen" key={n}>
            <div className="cs1-dir-letter" style={{ fontSize: 11, opacity: 0.5 }}>{n}</div>
            <div className="cs1-dir-body">
              <div className="cs1-dir-title">{title}</div>
              <div className="cs1-dir-desc">{desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="cs1-north-star" style={{ marginTop: 28 }}>
        <div className="cs1-ns-label">The three surfaces</div>
        <div className="cs1-ns-text">
          <strong>Ecosystem Health Dashboard</strong> — live monitoring hub for all downtimes. &nbsp;
          <strong>Downtime Detail Page</strong> — impact analysis, recovery actions, and educational context. &nbsp;
          <strong>Transactions Dashboard</strong> — root-cause attribution for failed payments.
        </div>
      </div>
    </div>
  );
}

/* ─── DASHBOARD JOURNEY ─── */

/* ── Slide 19 — Dashboard Journey Intro + Video ── */
function SlideDashboardJourneyIntro() {
  return (
    <div className="cs1-si">
      <div className="cs1-slide-label">Dashboard Journey &middot; Overview</div>
      <h2 className="cs1-slide-h">Journey 1:<br />Dashboard-first discovery</h2>
      <p className="cs1-slide-p">
        The merchant proactively monitors the Ecosystem Health Dashboard, discovers an ongoing downtime, and navigates through the system to understand impact and take action.
      </p>
      <div className="cs1-video-prototype">
        <video
          className="cs1-video-frame"
          controls
          playsInline
          poster="/cs1/DashboardFlow_1.png"
        >
          {/* Compressed .mp4 (17 MB) — original .mov (51 MB) is gitignored. */}
          <source src="/cs1/Dashboard_video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="cs1-highlight" style={{ marginTop: 24 }}>
        <div className="cs1-highlight-label">Journey flow — 6 screens</div>
        <p>
          The dashboard journey walks through all key surfaces: ecosystem health overview, downtime detail pages, transaction attribution, and recovery actions. Watch the full flow to see how merchants move from discovery to decision.
        </p>
      </div>
    </div>
  );
}

/* ── Slide 20 — Dashboard Journey Screen 1: Ecosystem Health ── */
function SlideDashboardScreen1() {
  return (
    <div className="cs1-si">
      <div className="cs1-slide-label">Dashboard Journey &middot; Screen 1</div>
      <h2 className="cs1-slide-h">Ecosystem Health Dashboard:<br />Live monitoring hub</h2>
      <p className="cs1-slide-p">
        The dashboard shows real-time health status for all banks, card networks, and UPI providers — filtered to the merchant's enabled payment methods.
      </p>
      <div className="cs1-laptop-mockups">
        <div className="cs1-laptop-mockup">
          <div className="cs1-laptop-frame">
            <div className="cs1-laptop-screen">
              <div className="cs1-laptop-placeholder">
                <div className="cs1-laptop-placeholder-icon">🏥</div>
                <div className="cs1-laptop-placeholder-label">Ecosystem Health Dashboard</div>
                <div className="cs1-laptop-placeholder-title">Live health overview + incident monitoring</div>
              </div>
            </div>
            <div className="cs1-laptop-base"></div>
            <div className="cs1-laptop-hinge"></div>
          </div>
        </div>
      </div>
      <div className="cs1-highlight" style={{ marginTop: 24 }}>
        <div className="cs1-highlight-label">Key features</div>
        <p>
          <strong>Traffic-light indicators</strong> — green (healthy), yellow (degraded), red (down) for each provider. &nbsp;
          <strong>Ongoing vs planned</strong> — separate tabs for active incidents and scheduled maintenance. &nbsp;
          <strong>Merchant-specific filtering</strong> — only shows relevant payment methods. &nbsp;
          <strong>Historical log</strong> — full incident history with resolution times.
        </p>
      </div>
    </div>
  );
}

/* ── Slide 21 — Dashboard Journey Screen 2: Downtime Detail ── */
function SlideDashboardScreen2() {
  return (
    <div className="cs1-si">
      <div className="cs1-slide-label">Dashboard Journey &middot; Screen 2</div>
      <h2 className="cs1-slide-h">Downtime Detail Page:<br />Impact analysis &amp; recovery</h2>
      <p className="cs1-slide-p">
        From the dashboard, the merchant clicks into a specific downtime to see detailed impact metrics, recommended recovery actions, and educational context.
      </p>
      <div className="cs1-laptop-mockups">
        <div className="cs1-laptop-mockup">
          <div className="cs1-laptop-frame">
            <div className="cs1-laptop-screen">
              <div className="cs1-laptop-placeholder">
                <div className="cs1-laptop-placeholder-icon">📊</div>
                <div className="cs1-laptop-placeholder-label">Downtime Detail Page</div>
                <div className="cs1-laptop-placeholder-title">Impact analysis + recommendations + education</div>
              </div>
            </div>
            <div className="cs1-laptop-base"></div>
            <div className="cs1-laptop-hinge"></div>
          </div>
        </div>
      </div>
      <div className="cs1-highlight" style={{ marginTop: 24 }}>
        <div className="cs1-highlight-label">What the detail page shows</div>
        <p>
          <strong>Timeline &amp; status</strong> — when it started, current status, estimated resolution. &nbsp;
          <strong>Impact metrics</strong> — failed transactions, GMV loss, SR drop percentage. &nbsp;
          <strong>Recovery actions</strong> — retry emails, API integration, checkout messaging. &nbsp;
          <strong>Educational context</strong> — why this happened and what Razorpay is doing.
        </p>
      </div>
    </div>
  );
}

/* ── Slide 22 — Dashboard Journey Screen 3: Transactions Dashboard ── */
function SlideDashboardScreen3() {
  return (
    <div className="cs1-si">
      <div className="cs1-slide-label">Dashboard Journey &middot; Screen 3</div>
      <h2 className="cs1-slide-h">Transactions Dashboard:<br />Root-cause attribution</h2>
      <p className="cs1-slide-p">
        The final step in the dashboard journey: the merchant reviews failed transactions with inline attribution tags linking directly to the downtime that caused them.
      </p>
      <div className="cs1-laptop-mockups">
        <div className="cs1-laptop-mockup">
          <div className="cs1-laptop-frame">
            <div className="cs1-laptop-screen">
              <div className="cs1-laptop-placeholder">
                <div className="cs1-laptop-placeholder-icon">💳</div>
                <div className="cs1-laptop-placeholder-label">Transactions Dashboard</div>
                <div className="cs1-laptop-placeholder-title">Anomaly detection + root-cause attribution</div>
              </div>
            </div>
            <div className="cs1-laptop-base"></div>
            <div className="cs1-laptop-hinge"></div>
          </div>
        </div>
      </div>
      <div className="cs1-highlight" style={{ marginTop: 24 }}>
        <div className="cs1-highlight-label">Attribution in context</div>
        <p>
          <strong>Anomaly banner</strong> — surfaces when a significant failure cluster is detected. &nbsp;
          <strong>Root-cause grouping</strong> — failed transactions auto-grouped by downtime. &nbsp;
          <strong>Inline tags</strong> — each row shows its specific failure reason with a link to the detail page. &nbsp;
          <strong>Answered before asked</strong> — "Is this us or Razorpay?" is resolved at a glance.
        </p>
      </div>
    </div>
  );
}

/* ─── EMAIL JOURNEY ─── */

/* ── Slide 23 — Email Journey Header ── */
function SlideEmailJourneyHeader() {
  return (
    <div className="cs1-si">
      <div className="cs1-slide-label">Email Journey &middot; Overview</div>
      <h2 className="cs1-slide-h">Journey 2:<br />Alert-driven discovery</h2>
      <p className="cs1-slide-p">
        The merchant receives a proactive email alert from Razorpay the moment a high-impact downtime is detected, then navigates through the system to understand and act.
      </p>
      <div className="cs1-north-star" style={{ marginBottom: 28 }}>
        <div className="cs1-ns-label">The difference</div>
        <div className="cs1-ns-text">
          Unlike the dashboard journey where the merchant discovers the issue themselves, the email journey is <strong>proactive</strong> — Razorpay detects the downtime and alerts the merchant before they even check the dashboard.
        </div>
      </div>
      <div className="cs1-highlight">
        <div className="cs1-highlight-label">Journey flow</div>
        <p>
          <strong>Screen 1: Email Alert</strong> — merchant receives downtime notification with severity and impact. &nbsp;
          <strong>Screen 2: Downtime Detail Page</strong> — clicks email CTA to land on detail page. &nbsp;
          <strong>Screen 3: Transactions Dashboard</strong> — reviews failed transactions with attribution.
        </p>
      </div>
    </div>
  );
}

/* ── Slide 24 — Email Journey Intro + Video ── */
function SlideEmailJourneyIntro() {
  return (
    <div className="cs1-si">
      <div className="cs1-slide-label">Email Journey &middot; Walkthrough</div>
      <h2 className="cs1-slide-h">From alert to action<br />in under 2 minutes</h2>
      <p className="cs1-slide-p">
        Watch how a merchant receives a downtime alert, clicks through to the detail page, and takes recovery action — all without ever contacting support.
      </p>
      <div className="cs1-video-prototype">
        <video
          className="cs1-video-frame"
          controls
          playsInline
          poster="/cs1/EmailFlow_1.png"
        >
          {/* Use the compressed .mp4 (27 MB) — the original .mov is 73 MB and
              is gitignored. If browsers stop accepting mp4-in-quicktime, keep
              both source lines but point them at the smaller file. */}
          <source src="/cs1/Email_video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="cs1-highlight" style={{ marginTop: 24 }}>
        <div className="cs1-highlight-label">Journey flow — 8 screens</div>
        <p>
          The email journey demonstrates the complete alert-to-resolution flow: from receiving the proactive notification to confirming recovery. Watch how merchants move from awareness to action without contacting support.
        </p>
      </div>
    </div>
  );
}

/* ── Slide 25 — Email Journey Screen 1: Email Alert ── */
function SlideEmailScreen1() {
  return (
    <div className="cs1-si">
      <div className="cs1-slide-label">Email Journey &middot; Screen 1</div>
      <h2 className="cs1-slide-h">Email Alert:<br />Proactive notification</h2>
      <p className="cs1-slide-p">
        The moment Razorpay detects a high-impact downtime affecting the merchant's payment methods, an email alert is sent with clear severity, impact summary, and a single CTA.
      </p>
      <div className="cs1-laptop-mockups">
        <div className="cs1-laptop-mockup">
          <div className="cs1-laptop-frame">
            <div className="cs1-laptop-screen">
              <div className="cs1-laptop-placeholder">
                <div className="cs1-laptop-placeholder-icon">📧</div>
                <div className="cs1-laptop-placeholder-label">Email Alert</div>
                <div className="cs1-laptop-placeholder-title">Proactive downtime notification</div>
              </div>
            </div>
            <div className="cs1-laptop-base"></div>
            <div className="cs1-laptop-hinge"></div>
          </div>
        </div>
      </div>
      <div className="cs1-highlight" style={{ marginTop: 24 }}>
        <div className="cs1-highlight-label">Email content</div>
        <p>
          <strong>Subject line</strong> — "High Impact: ICICI bank downtime detected" (severity-first). &nbsp;
          <strong>Summary</strong> — what's happening, when it started, estimated impact. &nbsp;
          <strong>Single CTA</strong> — "View Impact Details" → direct link to detail page. &nbsp;
          <strong>No clutter</strong> — only essential information to enable immediate action.
        </p>
      </div>
    </div>
  );
}

/* ── Slide 26 — Email Journey Screen 2: Detail from Email ── */
function SlideEmailScreen2() {
  return (
    <div className="cs1-si">
      <div className="cs1-slide-label">Email Journey &middot; Screen 2</div>
      <h2 className="cs1-slide-h">Downtime Detail Page:<br />From email to understanding</h2>
      <p className="cs1-slide-p">
        The merchant clicks the email CTA and lands directly on the Downtime Detail Page — no searching, no navigation, no waiting for support.
      </p>
      <div className="cs1-laptop-mockups">
        <div className="cs1-laptop-mockup">
          <div className="cs1-laptop-frame">
            <div className="cs1-laptop-screen">
              <div className="cs1-laptop-placeholder">
                <div className="cs1-laptop-placeholder-icon">📊</div>
                <div className="cs1-laptop-placeholder-label">Downtime Detail Page</div>
                <div className="cs1-laptop-placeholder-title">Clicked from email alert</div>
              </div>
            </div>
            <div className="cs1-laptop-base"></div>
            <div className="cs1-laptop-hinge"></div>
          </div>
        </div>
      </div>
      <div className="cs1-highlight" style={{ marginTop: 24 }}>
        <div className="cs1-highlight-label">The merchant sees</div>
        <p>
          <strong>Full timeline</strong> — started 1hr 45min ago, currently ongoing. &nbsp;
          <strong>Impact numbers</strong> — 571 transactions affected, 45% of total failures today. &nbsp;
          <strong>SR graph</strong> — visual proof showing the exact moment the downtime caused the SR drop. &nbsp;
          <strong>Recovery actions</strong> — retry email template, API integration docs, checkout messaging guide.
        </p>
      </div>
    </div>
  );
}

/* ── Slide 27 — Email Journey Screen 3: Dashboard from Email ── */
function SlideEmailScreen3() {
  return (
    <div className="cs1-si">
      <div className="cs1-slide-label">Email Journey &middot; Screen 3</div>
      <h2 className="cs1-slide-h">Transactions Dashboard:<br />Complete the loop</h2>
      <p className="cs1-slide-p">
        After reviewing impact on the detail page, the merchant navigates to the Transactions Dashboard to see exactly which payments failed and confirm the root cause attribution.
      </p>
      <div className="cs1-laptop-mockups">
        <div className="cs1-laptop-mockup">
          <div className="cs1-laptop-frame">
            <div className="cs1-laptop-screen">
              <div className="cs1-laptop-placeholder">
                <div className="cs1-laptop-placeholder-icon">💳</div>
                <div className="cs1-laptop-placeholder-label">Transactions Dashboard</div>
                <div className="cs1-laptop-placeholder-title">Root-cause attribution confirmed</div>
              </div>
            </div>
            <div className="cs1-laptop-base"></div>
            <div className="cs1-laptop-hinge"></div>
          </div>
        </div>
      </div>
      <div className="cs1-highlight" style={{ marginTop: 24 }}>
        <div className="cs1-highlight-label">Journey complete</div>
        <p>
          From receiving the email to confirming which transactions failed: <strong>under 2 minutes</strong>. &nbsp;
          No support escalation. No engineering war room. No 6-hour wait for RCA. &nbsp;
          The merchant has full context to make business decisions: pause campaigns, queue retry emails, update checkout messaging.
        </p>
      </div>
    </div>
  );
}

/* ─── PARAMETERIZED SCREEN COMPONENTS ─── */

/* ── Dashboard Screen N (1-6) — Displays actual screen mockups ── */
function SlideDashboardScreen({ screen }: { screen: number }) {
  const screenLabels: Record<number, string> = {
    1: "Ecosystem Health Dashboard",
    2: "Downtime Detail Page",
    3: "Transactions Dashboard with Attribution",
    4: "Recovery Actions Panel",
    5: "Historical Timeline View",
    6: "Multi-downtime Overview"
  };

  return (
    <div className="cs1-si">
      <div className="cs1-slide-label">Dashboard Journey &middot; Screen {screen}</div>
      <h2 className="cs1-slide-h">{screenLabels[screen] || `Screen ${screen}`}</h2>
      <div className="cs1-laptop-mockups">
        <img
          src={`/cs1/DashboardFlow_${screen}.png`}
          alt={`Dashboard flow screen ${screen}`}
          style={{ width: '100%', maxWidth: '900px', height: 'auto', margin: '0 auto', display: 'block' }}
        />
      </div>
    </div>
  );
}

/* ── Email Screen N (1-8) — Displays actual screen mockups ── */
function SlideEmailScreen({ screen }: { screen: number }) {
  const screenLabels: Record<number, string> = {
    1: "Email Alert Received",
    2: "Downtime Detail Page (from email)",
    3: "Transactions Dashboard",
    4: "Recovery Actions",
    5: "Email Template Setup",
    6: "Team Notification",
    7: "Impact Analysis",
    8: "Resolution Confirmation"
  };

  return (
    <div className="cs1-si">
      <div className="cs1-slide-label">Email Journey &middot; Screen {screen}</div>
      <h2 className="cs1-slide-h">{screenLabels[screen] || `Screen ${screen}`}</h2>
      <div className="cs1-laptop-mockups">
        <img
          src={`/cs1/EmailFlow_${screen}.png`}
          alt={`Email flow screen ${screen}`}
          style={{ width: '100%', maxWidth: '900px', height: 'auto', margin: '0 auto', display: 'block' }}
        />
      </div>
    </div>
  );
}

/* ── Slide 20 — Results & Learnings ── */
function SlideOutcome() {
  return (
    <div className="cs1-si">
      <div className="cs1-slide-label">Results</div>
      <h2 className="cs1-slide-h">Shipped October 2025.<br />Three signals define success.</h2>
      <p className="cs1-slide-p">
        Launched to 3,900+ Mid-Market and Enterprise merchants in October 2025. The hypothesis: personalised, real-time downtime visibility integrated into existing workflows can cut debugging time from 6+ hours to under 5 minutes.
      </p>
      <div className="cs1-outcome-grid" style={{ marginBottom: 28 }}>
        {[
          ["30–40%",  "Reduction in payment-failure support tickets from dashboard-using cohorts"],
          ["< 5 min", "Time-to-diagnosis, down from 6+ hours of engineering war rooms"],
          ["3,900+",  "MM + Enterprise merchants reached at launch across the three-surface system"],
        ].map(([num, label]) => (
          <div className="cs1-outcome-stat" key={num}>
            <div className="cs1-outcome-n">{num}</div>
            <div className="cs1-outcome-l">{label}</div>
          </div>
        ))}
      </div>
      <blockquote className="cs1-bq cs1-bq--featured" style={{ marginBottom: 28 }}>
        <p>&ldquo;Now it doesn&rsquo;t stop at seeing failures — I can immediately confirm if a downtime caused them, click through to see GMV and SR impact, or share downtime details with my team. This saves hours and lets us act quickly.&rdquo;</p>
        <cite>Ananya Sharma, Product Manager at Bluestone.com</cite>
      </blockquote>
      <div className="cs1-reflections">
        <div className="cs1-refl">
          <div className="cs1-refl-label">What I&rsquo;d do differently</div>
          <p>Push the InsightX SR-graph integration into Phase 1. In every merchant interview, the SR trend graph was the first surface referenced when describing how they monitored for problems. We knew this and still left it to Phase 2.</p>
        </div>
        <div className="cs1-refl">
          <div className="cs1-refl-label">What this project taught me</div>
          <p>Merchants don&rsquo;t use the word &ldquo;downtime&rdquo; — they use &ldquo;my payments are failing.&rdquo; The entire reframe from alerting to attribution changed the product direction. Getting the problem statement right was 70% of the design work.</p>
        </div>
      </div>
    </div>
  );
}
