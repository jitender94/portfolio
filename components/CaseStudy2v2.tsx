"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PhoneSlideshow from "./PhoneSlideshow";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSwitch: () => void;
}

/* ─── Slide data (PhoneSlideshow inputs) ─── */

const getStartedSlides = [
  { src: "/cs2/get-started/splash.gif", annotation: "Splash screen — the first thing a field agent sees when they open the Task Force App" },
  { src: "/cs2/get-started/1.png", annotation: "OTP login — secure agent authentication via registered mobile number" },
  { src: "/cs2/get-started/2.png", annotation: "Day overview — personalised greeting, 20 open tickets, swipe to start working" },
  { src: "/cs2/get-started/3.png", annotation: "Homepage — tickets sorted by priority with TAT and distance indicators" },
  { src: "/cs2/get-started/4.png", annotation: "Inventory widget — devices (25) and SIMs (25) available at a glance" },
  { src: "/cs2/get-started/5.png", annotation: "Sort options — filter tickets by Priority, TAT, or Distance" },
  { src: "/cs2/get-started/7.png", annotation: "Inventory detail — all assigned A910 devices with serial numbers" },
  { src: "/cs2/get-started/8.png", annotation: "SIM inventory — carrier-wise SIMs ready to assign to devices" },
];

const installationSlides = [
  { src: "/cs2/installation/Installation1.png", annotation: "Ticket card — merchant details, 2 TIDs, overdue status, directions & call shortcuts" },
  { src: "/cs2/installation/Installation2.png", annotation: "Installation start — Total TIDs: 02, Mapped: 00 · all ticket details pre-populated" },
  { src: "/cs2/installation/Mapping3.png", annotation: "Device scan — barcode scanner reads serial number (primary input path)" },
  { src: "/cs2/installation/Mapping4.png", annotation: "Serial confirmed ✓ — SIM number entry with live inventory suggestions below" },
  { src: "/cs2/installation/Mapping6.png", annotation: "SIM selected from inventory — matched and confirmed, proceed to next step" },
  { src: "/cs2/installation/Mapping12.png", annotation: "SIM barcode scanner — secondary path; used when SIM barcode is readable" },
  { src: "/cs2/installation/Mapping13.png", annotation: "All TIDs mapped successfully 🎉 — do test transactions, then upload photos" },
  { src: "/cs2/installation/Checklist1.png", annotation: "Feature & device checklist — training items verified, device accessories confirmed" },
  { src: "/cs2/installation/Upload1.png", annotation: "Photo upload — shop board, inside view, devices photo (all required for compliance)" },
  { src: "/cs2/installation/Upload8.png", annotation: "All photos uploaded ✓ — proceed to merchant OTP" },
  { src: "/cs2/installation/Validation1.png", annotation: "Merchant OTP — enter representative name and mobile number for verification" },
  { src: "/cs2/installation/Validation3.png", annotation: "OTP sent to merchant — awaiting 6-digit confirmation" },
  { src: "/cs2/installation/Confirmation1.png", annotation: "Installation complete ✓ — confirmation sent to merchant, save installation copy" },
];

const deactivationSlides = [
  { src: "/cs2/deactivation/Deactivation1.png", annotation: "Deactivation ticket — merchant info, 2 TIDs, 2 days left, device & SIM inventory confirmed" },
  { src: "/cs2/deactivation/Unmapping1.png", annotation: "Deactivation start — Total TIDs: 02, Unmapped: 00 · begin device unmapping" },
  { src: "/cs2/deactivation/Unmapping5.png", annotation: "Unmap TID — device serial + SIM confirmed, device status marked: Not working" },
  { src: "/cs2/deactivation/Unmapping10.png", annotation: "All TIDs unmapped successfully 🎉 — upload photos to proceed" },
  { src: "/cs2/deactivation/Validation1.png", annotation: "Merchant OTP — 05 TIDs confirmed, enter representative contact for verification" },
  { src: "/cs2/deactivation/Deactivation-confirmation.png", annotation: "Deactivation complete ✓ — confirmation sent to merchant, save copy" },
];

const servicingSlides = [
  { src: "/cs2/servicing/Servicing1.png", annotation: "Servicing ticket — merchant info and TIDs to swap, phase 1 begins" },
  { src: "/cs2/servicing/Servicing2.png", annotation: "Servicing flow — old device removal and replacement sequenced in one ticket" },
  { src: "/cs2/deactivation/Unmapping5.png", annotation: "Unmap TID — old device serial + SIM confirmed, status logged (working/not working/missing)" },
  { src: "/cs2/deactivation/Unmapping10.png", annotation: "Old devices unmapped ✓ — phase 1 complete, proceed to install replacement" },
  { src: "/cs2/installation/Installation2.png", annotation: "Phase 2 — New device installation: map replacement TIDs in the same ticket" },
  { src: "/cs2/installation/Mapping3.png", annotation: "Scan new device serial — same scan-first mapping flow as standalone installation" },
  { src: "/cs2/installation/Mapping13.png", annotation: "New devices mapped ✓ — proceed to photo documentation" },
  { src: "/cs2/installation/Upload1.png", annotation: "Photo upload — FE captures device placement, serial label, and merchant setup" },
  { src: "/cs2/installation/Upload4.png", annotation: "Uploading photos — multiple angles required before ticket can be closed" },
  { src: "/cs2/installation/Upload8.png", annotation: "Photos uploaded ✓ — move to OTP verification with merchant" },
  { src: "/cs2/installation/Validation1.png", annotation: "OTP verification — merchant receives OTP to confirm device is live and working" },
  { src: "/cs2/installation/Validation3.png", annotation: "OTP verified ✓ — transaction confirmed, device active at merchant site" },
  { src: "/cs2/installation/Checklist1.png", annotation: "Pre-closure checklist — FE confirms all steps: SIM active, test txn passed, photos done" },
  { src: "/cs2/installation/Checklist2.png", annotation: "Checklist complete ✓ — all items signed off, ready to close ticket" },
  { src: "/cs2/servicing/Servicing completed.png", annotation: "Servicing complete ✓ — old device out, new device live, confirmation sent" },
];

const revisitSlides = [
  { src: "/cs2/edge-cases/Revisit1.png", annotation: "'Issues with the task?' — choose Revisit, select a rescheduled date and reason" },
  { src: "/cs2/edge-cases/Revisit3.png", annotation: "Date selected: 23/12/2024 — reason: Merchant not present / shop closed" },
  { src: "/cs2/edge-cases/Revisit5.png", annotation: "Other reason — free text comment captured: 'Merchant not picking up call'" },
  { src: "/cs2/edge-cases/Revisit7.png", annotation: "Task rescheduled for 23rd December ✓ — reason logged, return to homepage" },
];

const problematicSlides = [
  { src: "/cs2/edge-cases/Problematic1.png", annotation: "Problematic ticket — mark ticket for escalation and provide details" },
  { src: "/cs2/edge-cases/Problematic2.png", annotation: "Reason selection — choose escalation category: Merchant dispute / hardware issue / other" },
  { src: "/cs2/edge-cases/Problematic4.png", annotation: "Additional comments — FE provides context for back-office resolution" },
  { src: "/cs2/edge-cases/Problematic6.png", annotation: "Escalated ✓ — ticket flagged for manager review, removed from FE's queue" },
];

/* ─── 22 Slides total ───
   Brief section is ONE consolidated slide.
   Research has Opening + Context + Context Details + ALL 6 Insights on one slide.
   Outcome is split: Stats slide (numbers + bullets) + Reflections slide. */
const SLIDES = [
  "Overview",                          // 0 — cover
  "Initial Brief",                     // 1 — consolidated 2x2 grid
  "Research",                          // 2 HERO
  "Research Opening",                  // 3 — H2 + PRD intro + Bengaluru callout
  "Research Context",                  // 4 — Who is a Field Executive
  "Context Details",                   // 5 — Requests + flow + journey
  "Research Insights",                 // 6 — All 6 insights consolidated, Layout A style
  "Problem",                           // 7 HERO
  "HMW Questions",                     // 8
  "Defining Success",                  // 9 HERO
  "Success Cards",                     // 10
  "Ideation",                          // 11 HERO
  "Design Decisions",                  // 12
  "Solution",                          // 13 HERO
  "Get Started Flow",                  // 14
  "Installation Flow",                 // 15
  "Deactivation Flow",                 // 16
  "Servicing Flow",                    // 17
  "Edge Cases",                        // 18
  "Outcome",                           // 19 HERO
  "Outcome Stats",                     // 20 — H2 + 4 stat cards + 6 bullets
  "Reflections",                       // 21 — What worked / What I'd do differently
];

/* Hero slides get a diamond dot in the footer.
   Brief no longer has a separate hero — it's a single content slide. */
const HERO_SLIDES = new Set([2, 7, 9, 11, 13, 19]);

/* Footer section groups */
const SECTIONS = [
  { label: "Overview",   range: [0, 0]   as [number, number] },
  { label: "Brief",      range: [1, 1]   as [number, number] },
  { label: "Research",   range: [2, 6]   as [number, number] },
  { label: "Problem",    range: [7, 8]   as [number, number] },
  { label: "Success",    range: [9, 10]  as [number, number] },
  { label: "Ideation",   range: [11, 12] as [number, number] },
  { label: "Solution",   range: [13, 18] as [number, number] },
  { label: "Outcome",    range: [19, 21] as [number, number] },
];

export default function CaseStudy2v2({ isOpen, onClose, onSwitch }: Props) {
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
    if (isOpen) window.history.pushState({ overlay: "cs2v2" }, "");
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
              <div className="cs-layout-toggle">
                <button className="cs-layout-btn" onClick={onSwitch}>Layout A</button>
                <button className="cs-layout-btn active">Layout B</button>
              </div>
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
   Slide routing — 30 slides, Downtime-styled
───────────────────────────────────────────────────────── */

function SlideContent({ index }: { index: number }) {
  switch (index) {
    case  0: return <SlideOverview />;
    case  1: return <SlideBrief />;
    case  2: return <SlideHeroResearch />;
    case  3: return <SlideResearchOpening />;
    case  4: return <SlideResearchContext />;
    case  5: return <SlideContextDetails />;
    case  6: return <SlideInsights />;
    case  7: return <SlideHeroProblem />;
    case  8: return <SlideHMW />;
    case  9: return <SlideHeroSuccess />;
    case 10: return <SlideTimeline />;
    case 11: return <SlideHeroIdeation />;
    case 12: return <SlideDesignDecisions />;
    case 13: return <SlideHeroSolution />;
    case 14: return <SlideSurface name="get-started" />;
    case 15: return <SlideSurface name="installation" />;
    case 16: return <SlideSurface name="deactivation" />;
    case 17: return <SlideSurface name="servicing" />;
    case 18: return <SlideEdgeCases />;
    case 19: return <SlideHeroOutcome />;
    case 20: return <SlideOutcomeStats />;
    case 21: return <SlideReflections />;
    default: return null;
  }
}

/* ─────────────────────────────────────────────────────────
   Section hero helper — identical pattern to CaseStudy1
───────────────────────────────────────────────────────── */

function SectionHero({
  num,
  title,
  sub,
}: {
  num: string;
  title: string;
  sub: string;
}) {
  return (
    <div className="cs1-si cs1-si--hero">
      <div className="cs1-hero-ghost" aria-hidden="true">{num}</div>
      <div className="cs1-hero-eyebrow">Section {num}</div>
      <div className="cs1-hero-rule" />
      <h2 className="cs1-hero-title">{title}</h2>
      <p className="cs1-hero-sub">{sub}</p>
    </div>
  );
}

/* ── Section heroes ── Subtitles use the section H2 verbatim from Layout A.
   Note: Initial Brief has NO section hero — it's a single content slide
   (see SlideBrief) to mirror Layout A's compact 2x2 grid pattern. ── */

function SlideHeroResearch() {
  return (
    <SectionHero
      num="01"
      title="Research"
      sub="Going to the field made it clear — the problem wasn't just the tools. It was the entire process."
    />
  );
}

function SlideHeroProblem() {
  return (
    <SectionHero
      num="02"
      title="Problem"
      sub="The problems ran deeper than any single tool. Agents, merchants, and Razorpay were all losing trust in the same system."
    />
  );
}

function SlideHeroSuccess() {
  return (
    <SectionHero
      num="03"
      title="Defining Success"
      sub="We defined what success looks like before we ideated solutions."
    />
  );
}

function SlideHeroIdeation() {
  return (
    <SectionHero
      num="04"
      title="Ideation"
      sub="The hardest decision was not what to design. It was deciding what kind of product we were building at all."
    />
  );
}

function SlideHeroSolution() {
  return (
    <SectionHero
      num="05"
      title="Solution"
      sub="One app for the entire day. Built around what field engineers actually do."
    />
  );
}

function SlideHeroOutcome() {
  return (
    <SectionHero
      num="06"
      title="Outcome"
      sub="Shipped to all 276 agents across India in May 2025. Here is what the data showed."
    />
  );
}

/* ─────────────────────────────────────────────────────────
   Content slides — 23 content slides total
───────────────────────────────────────────────────────── */

/* ── Slide 0 — Overview / Cover — EXCEPTION to "Layout A content verbatim"
   rule. Per explicit instruction, the cover keeps the previously-aligned
   Downtime-style structure: title + em subtitle, 2-paragraph hook with
   emphasis, meta row, outcomes strip. The wording is portfolio-shaped (not
   copied from Layout A's prose) because this version was already approved. ── */
function SlideOverview() {
  return (
    <div className="cs1-si cs1-si--cover">
      {/* Two-column: title + hook left / phone-in-hand mockup right.
          Fixed right column width (520px) makes the phone visually prominent
          (~50% larger than the previous 340 cap). Text wraps a little more on
          the left in exchange — that's intentional, fills the slide more fully. */}
      <div
        className="cs1-cover-hero-grid"
        style={{ gridTemplateColumns: "1fr 470px", alignItems: "center", gap: 56 }}
      >
        <div className="cs1-cover-left">
          <h1
            className="cs1-cover-h"
            style={{ fontSize: "clamp(34px, 3.6vw, 52px)", marginBottom: 24 }}
          >
            Task Force App,<br /><em>field operations rebuilt.</em>
          </h1>
          <p className="cs1-cover-hook">
            <strong>276 field agents</strong> were planning 10–15 merchant visits a day off{" "}
            <strong>WhatsApp messages</strong> and <strong>paper notes</strong> — using a bot that worked half the time and a vendor stack costing <strong>₹7 lakh a month</strong>.
          </p>
          <p className="cs1-cover-hook" style={{ marginBottom: 0 }}>
            We rebuilt the entire field-operations experience from scratch. <strong>40% of agents</strong> adopted it in a single day.
          </p>
        </div>
        <div
          className="cs1-cover-right"
          style={{
            overflow: "visible",
            marginRight: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src="/cs1/FE_App_Mock.png"
            alt="Task Force App — hand holding a phone showing the app"
            className="cs1-cover-img"
            style={{
              width: "100%",
              maxWidth: 470,
              height: "auto",
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>
      </div>

      {/* Meta row — Layout A's overview keys/values verbatim */}
      <div className="cs1-meta">
        {[
          ["Role",     "Research · Prototyping · Product Design"],
          ["Timeline", "3–4 months"],
          ["Reach",    "276 agents, Pan-India"],
          ["Platform", "Progressive Web App"],
        ].map(([label, val]) => (
          <div className="cs1-meta-cell" key={label}>
            <div className="cs1-meta-label">{label}</div>
            <div className="cs1-meta-val">{val}</div>
          </div>
        ))}
      </div>

      {/* Outcomes strip — Downtime structural element, headline numbers from Layout A's section 06 */}
      <div className="cs1-cover-outcomes">
        {[
          ["+12.5%", "Tickets closed per day — 1,227 → 1,380"],
          ["−57%",   "De-installation time — 4.82 days → 2.07 days"],
          ["40%+",   "Agent adoption in 1 day across all 276 agents"],
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

/* ── Slide 1 — Initial Brief — ONE consolidated slide with Layout A's 2x2 grid.
   Section label + H2 + intro paragraph + 4 brief cards + the "More issues"
   accordion (verbatim from Layout A). Slide extends naturally when expanded —
   .cs1-slide uses min-height (not height), so the extra accordion content
   grows the slide and the scroll-snap handles it gracefully. ── */
function SlideBrief() {
  const [moreExpanded, setMoreExpanded] = useState(false);

  const cards: { stat: string; title: string; desc: string }[] = [
    {
      stat:  "60+ min",
      title: "Installation bottlenecks",
      desc:  "Enterprise setups took 60+ minutes. Multi-tool fragmentation forced agents to re-enter data with no single source of truth.",
    },
    {
      stat:  "₹7L/month",
      title: "Vendor dependency",
      desc:  "Asti + TAMS cost ₹7L/month and routinely failed. Bot success rate was ~50% — agents had stopped trusting both tools.",
    },
    {
      stat:  "8,000",
      title: "Zero device accountability",
      desc:  "8,000 devices left premises unverified — a ₹1 Cr P&L hit. No audit trail, no way to know where they went.",
    },
    {
      stat:  "16.5%",
      title: "Post-closure service violations",
      desc:  "16.5% of closed tickets saw violations raised within 7 days — closures happening without verification or merchant sign-off.",
    },
  ];

  const moreIssues: [string, string][] = [
    ["Dual-vendor stack failure",       "SAP B1 via TAMS (backend) and Asti (frontend) ran in silos. Asti had persistent technical issues — agents stopped trusting it entirely."],
    ["Bot fallback breakdown",          "WhatsApp bot worked ~50% of the time. When it failed, agents called Customer Support — adding 45+ minutes to a 5-minute task."],
    ["Repeat visits bleeding P&L",      "Each agent visit cost ₹280. Repeat visits caused purely by tool failures compounded directly into P&L."],
    ["Merchant satisfaction unverified", "CSAT after field resolution hovered at ~80%, with no mechanism to verify installs or explain device issues."],
  ];

  return (
    <div className="cs1-si">
      <div className="cs1-slide-label">01 &middot; Initial brief</div>
      <h2 className="cs1-slide-h">
        Field agents are the backbone of POS merchant onboarding.<br />Their tools were failing them.
      </h2>
      <p className="cs1-slide-p">
        The initial product brief surfaced systemic failures across analytics, operations, and business metrics. Four critical gaps were identified — each compounding the others, and each entirely preventable with the right tool.
      </p>

      {/* 2x2 grid of brief cards — these are PROBLEMS, so they use Layout A's
          red-wash treatment: #fff5f4 background + #b03a2e stat colour.
          Grid gap acts as a 2px divider via background trick. */}
      <div
        style={{
          marginTop: 28,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 2,
          background: "var(--cs-border)",
          border: "1px solid var(--cs-border)",
        }}
      >
        {cards.map((c) => (
          <div
            key={c.title}
            style={{
              background: "#fff5f4",
              padding: "32px 28px",
              display: "flex",
              flexDirection: "column",
              gap: 0,
            }}
          >
            <div
              style={{
                fontFamily: "var(--display-font)",
                fontWeight: 700,
                fontSize: "clamp(32.2px, 3.22vw, 46px)",
                lineHeight: 1,
                color: "#b03a2e",
                letterSpacing: "0.01em",
                marginBottom: 12,
              }}
            >
              {c.stat}
            </div>
            <div
              style={{
                fontSize: 17,
                fontWeight: 600,
                color: "var(--cs-text)",
                marginBottom: 12,
              }}
            >
              {c.title}
            </div>
            <div
              style={{
                fontSize: 15,
                color: "var(--cs-muted)",
                lineHeight: 1.7,
              }}
            >
              {c.desc}
            </div>
          </div>
        ))}
      </div>

      {/* "More issues" accordion — verbatim from Layout A.
          When expanded, the slide grows naturally (min-height not height). */}
      <div className="cs-brief-accordion" style={{ marginTop: 28 }}>
        <button
          className="cs-brief-accordion-trigger"
          onClick={() => setMoreExpanded(v => !v)}
          aria-expanded={moreExpanded}
        >
          <span>More issues highlighted in Initial brief</span>
          <span className="cs-brief-accordion-icon">{moreExpanded ? "−" : "+"}</span>
        </button>
        <AnimatePresence initial={false}>
          {moreExpanded && (
            <motion.div
              key="more-issues"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }}
              style={{ overflow: "hidden" }}
            >
              <div className="cs-brief-accordion-body">
                <ul className="cs-brief-points">
                  {moreIssues.map(([label, desc]) => (
                    <li key={label}>
                      <strong>{label}:</strong> {desc}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Slide 3 — Research Opening — section H2 + PRD intro + Bengaluru callout
   (this is how Layout A actually opens the Research section, BEFORE any
   subsection). Previously misplaced inside the Field Executive slide. ── */
function SlideResearchOpening() {
  return (
    <div className="cs1-si">
      <div className="cs1-slide-label">02 &middot; Research</div>
      <h2 className="cs1-slide-h">
        Going to the field made it clear — the problem wasn&rsquo;t just the tools. It was the entire process.
      </h2>
      <p className="cs1-slide-p">
        The PRD gave us the what. I needed the why. So before locking any problem statement, I went to the field — shadowed agents, ran group discussions, sat with the call centre. What I found changed the entire framing.
      </p>

      {/* Field visit observation — use Layout A's cs-v2-callout treatment
          (darker left bar accent + italic larger quote text) rather than the
          subtle cs1-highlight to give this opening anchor more visual weight. */}
      <div className="cs-v2-callout" style={{ marginTop: 28 }}>
        <div className="cs-v2-callout-label">Field visit observation &middot; Bengaluru</div>
        <div className="cs-v2-callout-text">
          Every morning, agents received a WhatsApp message from their team lead — a list of merchant names, ticket numbers, and pincodes. They copied this onto paper. Sorted by pincode. That was their route plan.
        </div>
      </div>
    </div>
  );
}

/* ── Slide 4 — Research Context: Who is a Field Executive — verbatim from
   Layout A's "Context" subsection. Just the FE definition + 3 personas now;
   the PRD intro and Bengaluru callout moved to SlideResearchOpening. ── */
function SlideResearchContext() {
  return (
    <div className="cs1-si">
      <div className="cs1-slide-label">Research &middot; Context</div>
      <h2 className="cs1-slide-h">Who is a Field Executive (FE)?</h2>
      <p className="cs1-slide-p">
        A field engineer is someone who visits offline merchants to resolve tickets in person. FEs are assigned to specific areas within a city — tickets are routed to them by geography to minimise travel. They get daily targets and report to the city office each morning to collect the devices they&rsquo;ll need for installations.
      </p>

      <div className="cs1-dirs" style={{ marginTop: 24 }}>
        {[
          ["Area-based assignment", "FEs cover specific zones. Tickets are allocated by pincode to minimise travel."],
          ["Daily targets",         "Each FE receives a ticket list and collects devices from the city office every morning."],
          ["EOD reporting",         "At end of day, FEs return to the city office, report back to their TL, and return collected devices."],
        ].map(([name, sub], i) => (
          <div className="cs1-dir cs1-dir--chosen" key={name}>
            <div className="cs1-dir-letter" style={{ fontSize: 11, opacity: 0.5 }}>{String(i + 1).padStart(2, "0")}</div>
            <div className="cs1-dir-body">
              <div className="cs1-dir-title">{name}</div>
              <div className="cs1-dir-desc" style={{ marginBottom: 0 }}>{sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Slide 5 — Context Details — ONE consolidated slide with three Layout A
   subsections combined: request types + request flow + current journey image.
   Uses Layout A's exact cs-v2-* classes so sizing matches (request cards have
   60×60 illustrations, faded num behind, light-grey bg). ── */
function SlideContextDetails() {
  const requests: [string, string, string, string][] = [
    ["01", "Installation", "New devices to be deployed at a merchant store.",            "/cs2/research/Installation.png"],
    ["02", "Deactivation", "Device deactivation and collection from the merchant store.", "/cs2/research/Deactivation.png"],
    ["03", "Servicing",    "Fixing of devices, including full device replacement.",       "/cs2/research/Servicing.png"],
  ];

  return (
    <div className="cs1-si">
      <div className="cs1-slide-label">Research &middot; Context</div>

      {/* ─ Subsection 1: What kind of requests do we get today? ─ */}
      <h3 className="cs-v2-surface-title" style={{ marginTop: 8, marginBottom: 16 }}>
        What kind of requests do we get today?
      </h3>
      <div className="cs-v2-request-types">
        {requests.map(([num, title, desc, img]) => (
          <div className="cs-v2-request-card" key={num}>
            <div className="cs-v2-request-num">{num}</div>
            <div className="cs-v2-request-title">{title}</div>
            <div className="cs-v2-request-desc">{desc}</div>
            <img src={img} alt={`${title} illustration`} className="cs-v2-request-illus" />
          </div>
        ))}
      </div>

      {/* ─ Subsection 2: How do we get these requests? (flow) ─ */}
      <h3 className="cs-v2-surface-title" style={{ marginTop: 24, marginBottom: 16 }}>
        How do we get these requests?
      </h3>
      <div className="cs-v2-flow-wrap">
        <div className="cs-v2-flow-row">
          <div className="cs-v2-flow-col">
            <div className="cs-v2-flow-node">
              <div className="cs-v2-flow-node-title">Enquiry from merchants</div>
            </div>
            <div className="cs-v2-flow-sub-items">
              <div className="cs-v2-flow-sub">Installation (Bank / direct)</div>
              <div className="cs-v2-flow-sub">Deinstallation / servicing (Service centre)</div>
            </div>
          </div>
          <div className="cs-v2-flow-arr">&#8594;</div>
          <div className="cs-v2-flow-col">
            <div className="cs-v2-flow-node">
              <div className="cs-v2-flow-node-title" style={{ fontWeight: 700 }}>Setup team</div>
              <div className="cs-v2-flow-node-sub">(handles onboarding)</div>
            </div>
          </div>
          <div className="cs-v2-flow-arr">&#8594;</div>
          <div className="cs-v2-flow-col">
            <div className="cs-v2-flow-node">
              <div className="cs-v2-flow-node-title" style={{ fontWeight: 700 }}>Central team</div>
              <div className="cs-v2-flow-node-sub">(Manages tickets: creation / allocation)</div>
            </div>
            <div className="cs-v2-flow-sub-items">
              <div className="cs-v2-flow-sub">Portal (ticket creation, manage, inventory)</div>
            </div>
          </div>
          <div className="cs-v2-flow-arr">&#8594;</div>
          <div className="cs-v2-flow-col">
            <div className="cs-v2-flow-node cs-v2-flow-node-hl">
              <div className="cs-v2-flow-node-title">Field Executive</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─ Subsection 3: Current journey of a Field Executive ─ */}
      <h3 className="cs-v2-surface-title" style={{ marginTop: 24, marginBottom: 16 }}>
        Current journey of a Field Executive
      </h3>
      <img
        src="/cs2/research/Current journey.png"
        alt="Current journey of a Field Executive"
        className="cs-v2-journey-img"
        style={{ marginTop: 0, marginBottom: 0 }}
      />
    </div>
  );
}

/* ── Slide 6 — Research Insights — ALL SIX consolidated on one slide.
   Uses Layout A's exact .cs-v2-insight* classes:
   - Default (text left, image right) for insights 3, 5
   - cs-v2-insight-rev (image left, text right) for insights 2, 4
   - cs-v2-insight-dual (text + 2 images, 1fr/400px) for insights 1, 6
   - Insight 4 swaps image column for cs-v2-pie chart (80/20 bars)
   - Alternating sides creates Layout A's natural reading rhythm. */
function SlideInsights() {
  return (
    <div className="cs1-si">
      <div className="cs1-slide-label">Research &middot; Insights</div>
      <h2 className="cs1-slide-h">Six insights that ended up<br />shaping every screen</h2>

      {/* Insight 01 — DUAL: text + two paired images (WhatsApp + paper) */}
      <div className="cs-v2-insight cs-v2-insight-dual">
        <div className="cs-v2-insight-body">
          <div className="cs-v2-insight-num">Insight 01</div>
          <div className="cs-v2-insight-title">FE day planning: receiving and prioritising tickets is a cumbersome process</div>
          <p className="cs-v2-insight-text">
            WhatsApp ticket list, copied to paper and re-sorted by pincode — any mid-day addition broke the plan.
          </p>
        </div>
        <div className="cs-v2-insight-imgs">
          <img src="/cs2/research/insight-1a.jpg" alt="WhatsApp messages with dense unformatted ticket list" className="cs-v2-insight-img" />
          <img src="/cs2/research/insight-1b.jpg" alt="Handwritten paper list of merchants and pincodes" className="cs-v2-insight-img" />
        </div>
      </div>

      {/* Insight 02 — REV: image on left, text on right */}
      <div className="cs-v2-insight cs-v2-insight-rev">
        <div className="cs-v2-insight-body">
          <div className="cs-v2-insight-num">Insight 02</div>
          <div className="cs-v2-insight-title">The process is not completely digital — physical service forms are still in use</div>
          <p className="cs-v2-insight-text">
            Every visit required a handwritten service form — submitted at EOD and re-entered manually, creating delays and transcription errors.
          </p>
        </div>
        <div className="cs-v2-insight-imgs">
          <img src="/cs2/research/insight-2.jpg" alt="Physical Razorpay service form filled by hand at merchant site" className="cs-v2-insight-img" />
        </div>
      </div>

      {/* Insight 03 — default: text on left, image on right */}
      <div className="cs-v2-insight">
        <div className="cs-v2-insight-body">
          <div className="cs-v2-insight-num">Insight 03</div>
          <div className="cs-v2-insight-title">Merchant training is not given efficiently</div>
          <p className="cs-v2-insight-text">
            Mandatory in theory, skipped under time pressure — merchants left to figure out their own devices.
          </p>
        </div>
        <div className="cs-v2-insight-imgs">
          <img src="/cs2/research/insight-3.jpg" alt="Field executive showing a merchant how to use the device" className="cs-v2-insight-img" />
        </div>
      </div>

      {/* Insight 04 — REV with cs-v2-pie chart (80/20 bars) instead of imgs */}
      <div className="cs-v2-insight cs-v2-insight-rev">
        <div className="cs-v2-insight-body">
          <div className="cs-v2-insight-num">Insight 04</div>
          <div className="cs-v2-insight-title">80% of tickets are retail but the 20% enterprise takes disproportionate time</div>
          <p className="cs-v2-insight-text">
            80% retail volume — but a single enterprise ticket could require 15 separate bot sessions.
          </p>
        </div>
        <div className="cs-v2-pie">
          <div>
            <div className="cs-v2-pie-pct">80%</div>
            <div className="cs-v2-pie-bar-wrap" style={{ marginTop: 6, marginBottom: 4 }}>
              <div className="cs-v2-pie-bar-fill" style={{ width: "80%", background: "#1657d4" }} />
            </div>
            <div className="cs-v2-pie-label">Retail &middot; 1 to 5 TIDs</div>
          </div>
          <div>
            <div className="cs-v2-pie-pct">20%</div>
            <div className="cs-v2-pie-bar-wrap" style={{ marginTop: 6, marginBottom: 4 }}>
              <div className="cs-v2-pie-bar-fill" style={{ width: "20%", background: "#93c5fd" }} />
            </div>
            <div className="cs-v2-pie-label">Enterprise &amp; mid-market &middot; 5+ TIDs</div>
          </div>
        </div>
      </div>

      {/* Insight 05 — default: text on left, image on right */}
      <div className="cs-v2-insight">
        <div className="cs-v2-insight-body">
          <div className="cs-v2-insight-num">Insight 05</div>
          <div className="cs-v2-insight-title">Over-reliance on the WhatsApp bot which only worked 50% of the time</div>
          <p className="cs-v2-insight-text">
            Frequent errors, no deactivation support, security gaps — every failure added 45+ min via the call centre. FEs had stopped trusting it.
          </p>
        </div>
        <div className="cs-v2-insight-imgs">
          <img src="/cs2/research/insight-5.jpg" alt="Razorpay POS WhatsApp support bot" className="cs-v2-insight-img" />
        </div>
      </div>

      {/* Insight 06 — DUAL: text + two paired images (old tool screens) */}
      <div className="cs-v2-insight cs-v2-insight-dual">
        <div className="cs-v2-insight-body">
          <div className="cs-v2-insight-num">Insight 06</div>
          <div className="cs-v2-insight-title">The Asti app (current solution) had fundamental experience and capability gaps</div>
          <p className="cs-v2-insight-text">
            No multi-device support, no deactivation, confusing flows, no iOS — a paid tool Razorpay couldn&rsquo;t roadmap, at ₹7L/month.
          </p>
        </div>
        <div className="cs-v2-insight-imgs">
          <img src="/cs2/research/insight-6a.jpg" alt="Asti app — Installation flow with fragmented fields" className="cs-v2-insight-img" />
          <img src="/cs2/research/insight-6b.jpg" alt="Asti app — Break Fix flow" className="cs-v2-insight-img" />
        </div>
      </div>
    </div>
  );
}

/* ── Slide 17 — Problem perspectives + North Star + HMW — verbatim from Layout A section 03 ── */
function SlideHMW() {
  const perspectives = [
    {
      title: "From the FE's perspective",
      items: [
        "Routes planned off WhatsApp + handwritten paper",
        "1 device per ticket → 5–15 bot sessions for enterprise",
        "Bot worked ~50% of the time",
        "Manual MID/TID entry on every visit",
        "Zero device trackability",
      ],
    },
    {
      title: "From the Merchant's perspective",
      items: [
        "60+ min installs for enterprise setups",
        "No device training or usage explanation",
        "SIM vs WiFi issues left unresolved",
        "No post-install verification",
        "No Razorpay brand touchpoint at closure",
      ],
    },
    {
      title: "From Razorpay's perspective",
      items: [
        "₹7L/month on vendors agents had stopped trusting",
        "8,000 devices lost → ₹1 Cr P&L hit",
        "No real-time FE visibility or route planning",
        "Zero compliance enforcement or audit trail",
        "Repeat visits at ₹280/trip bleeding operations",
      ],
    },
  ];

  return (
    <div className="cs1-si">
      <div className="cs1-slide-label">Problem &middot; Three perspectives</div>
      {/* Heading is one sentence; let it wrap naturally — Razorpay & were stay
          together as a unit via &nbsp; so we don't get an orphaned "were". */}
      <h2 className="cs1-slide-h">
        Agents, merchants, and Razorpay&nbsp;were all losing trust in the same system
      </h2>
      <p className="cs1-slide-p">
        Research synthesis bucketed the problems into three perspectives. Framing it this way changed the design conversation from &ldquo;make the bot better&rdquo; to &ldquo;rebuild the entire field experience.&rdquo;
      </p>

      <div
        style={{
          marginTop: 28,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
        }}
      >
        {perspectives.map(({ title, items }) => (
          <div
            key={title}
            style={{
              border: "1px solid var(--cs-border)",
              borderRadius: 8,
              padding: 20,
              background: "var(--cs-bg)",
            }}
          >
            <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--cs-text)", marginBottom: 12 }}>{title}</div>
            <ul style={{ margin: 0, paddingLeft: 18, color: "var(--cs-muted)", fontSize: 13, lineHeight: 1.55 }}>
              {items.map(it => (
                <li key={it} style={{ marginBottom: 6 }}>{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="cs1-north-star" style={{ marginTop: 28 }}>
        <div className="cs1-ns-label">North Star</div>
        <div className="cs1-ns-text">
          &ldquo;A field agent should complete a device installation in under 5 minutes, with full compliance, zero manual data entry, and a merchant who knows exactly what they&rsquo;ve signed up for.&rdquo;
        </div>
      </div>

      <div className="cs1-highlight" style={{ marginTop: 20 }}>
        <div className="cs1-highlight-label">How might we</div>
        <p>
          How do we design a field tool that helps agents work without friction, gives merchants a trustworthy experience at every visit, and gives Razorpay the real-time visibility it needs, without adding overhead to anyone&rsquo;s day?
        </p>
      </div>
    </div>
  );
}

/* ── Slide 19 — Defining Success — verbatim 5 success cards from Layout A ── */
function SlideTimeline() {
  const successCards: [string, string][] = [
    ["Reduces manual effort",     "FEs receive a pre-populated task list with merchant details, device info, and route context upfront — eliminating the daily WhatsApp copy-paste and handwritten planning."],
    ["Improves FE efficiency",    "Multiple devices serviced in a single ticket with scan-first mapping and auto-filled fields — so enterprise visits that took 60+ minutes complete in under 5."],
    ["Reduces ticket TAT",        "Digital ownership of every task means no undocumented delays. Tickets close faster and on-time rates improve, directly lifting Merchant CSAT."],
    ["Gives Razorpay visibility", "Every action — photo proof, device validation, merchant OTP, digital signature — is captured in real time. Zero compliance gaps, and 8,000 device losses become preventable."],
    ["Gives delight",             "Micro-interactions, illustrations, and continuous in-app feedback make the journey feel rewarding rather than bureaucratic — because agents who trust the tool will actually use it."],
  ];
  return (
    <div className="cs1-si">
      <div className="cs1-slide-label">Defining success</div>
      <h2 className="cs1-slide-h">We defined what success looks like<br />before we ideated solutions</h2>
      <p className="cs1-slide-p">
        Before moving to solutions, we defined success from every angle. A product that only helped the FE but ignored the merchant experience or helped compliance but frustrated agents would fail in the field.
      </p>

      <div
        style={{
          marginTop: 28,
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 16,
        }}
      >
        {successCards.map(([heading, desc]) => (
          <div
            key={heading}
            style={{
              border: "1px solid var(--cs-border)",
              borderRadius: 8,
              padding: 20,
              background: "var(--cs-bg)",
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--cs-text)", marginBottom: 8 }}>{heading}</div>
            <div style={{ fontSize: 13.5, color: "var(--cs-muted)", lineHeight: 1.6 }}>{desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Slide 21 — Ideation: 3 directions + 4 design decisions + user testing — verbatim Layout A section 04 ── */
function SlideDesignDecisions() {
  const directions = [
    {
      letter: "A",
      title:   "Patch Asti + improve the WhatsApp bot",
      desc:    "Fix the existing tools. Reduce validation errors. Improve bot reliability. Killed early, as agents had already lost trust in both tools. You can't design trust back into a product people associate with failure.",
      verdict: "✕ Killed: wrong foundation",
      killed:  true,
    },
    {
      letter: "B",
      title:   "Better frontend wrapper on existing backend",
      desc:    "A polished frontend over the same SAP B1 backend. Eliminated when engineering confirmed the backend was being migrated to SAP HANA. Building a wrapper would mean rebuilding the frontend twice within 1–2 quarters.",
      verdict: "✕ Killed: tech debt would follow",
      killed:  true,
    },
    {
      letter: "C",
      title:   "Ground-up Task Force App with smart task management",
      desc:    "Full replacement of Asti and the WhatsApp bot. Pre-populated task list, multi-device single-ticket mapping, barcode scan-first workflows, compliance enforcement, and inventory visibility, all in one reliable tool. Aligned with the SAP HANA migration roadmap. Eliminates vendor costs. Earns agent trust through reliability.",
      verdict: "✓ Chosen: clean slate, new trust, vendor eliminated",
      killed:  false,
    },
  ];

  const designDecisions: [string, string][] = [
    ["Swipe to Start",               "Originally attendance-only. Evolved into a dual-purpose surface — today's task count + type breakdown — so agents have a full day overview before they leave. The swipe (vs tap) marks the psychological start of the workday."],
    ["Homepage — 8–10 iterations",  "Balancing task list with priority, TAT, distance, and inventory at a glance. The hardest information-density problem: a screen used while standing in a merchant's shop."],
    ["Device Mapping",               "Progressive disclosure + scan-first + a success animation after each device maps. Made a multi-step, high-pressure flow feel manageable and even rewarding."],
    ["SIM scan as secondary",        "Initial assumption: scan-first for SIM too. User testing revealed 80–90% of SIM barcodes are absent in the field. Manual became primary; scan became the faster fallback."],
  ];

  return (
    <div className="cs1-si">
      <div className="cs1-slide-label">Ideation &middot; Direction</div>
      <h2 className="cs1-slide-h">Three directions evaluated.<br />One clean-slate choice.</h2>
      <p className="cs1-slide-p">
        Before screens, the strategic question was what kind of product to build — a patch on Asti, an extension of the WhatsApp bot, or a ground-up replacement. Three directions were evaluated.
      </p>

      <div className="cs1-dirs" style={{ marginTop: 24 }}>
        {directions.map(({ letter, title, desc, verdict, killed }) => (
          <div key={letter} className={`cs1-dir ${killed ? "cs1-dir--killed" : "cs1-dir--chosen"}`}>
            <div className="cs1-dir-letter">{letter}</div>
            <div className="cs1-dir-body">
              <div className="cs1-dir-title">{title}</div>
              <div className="cs1-dir-desc">{desc}</div>
              <div className="cs1-dir-verdict">{verdict}</div>
            </div>
          </div>
        ))}
      </div>

      <h3 className="cs1-slide-label" style={{ marginTop: 36, marginBottom: 12 }}>Key design decisions</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 16,
        }}
      >
        {designDecisions.map(([name, sub]) => (
          <div
            key={name}
            style={{
              border: "1px solid var(--cs-border)",
              borderRadius: 8,
              padding: 18,
              background: "var(--cs-bg)",
            }}
          >
            <div style={{ fontSize: 14.5, fontWeight: 700, color: "var(--cs-text)", marginBottom: 6 }}>{name}</div>
            <div style={{ fontSize: 13, color: "var(--cs-muted)", lineHeight: 1.55 }}>{sub}</div>
          </div>
        ))}
      </div>

      <h3 className="cs1-slide-label" style={{ marginTop: 36, marginBottom: 12 }}>User Testing</h3>
      <p className="cs1-slide-p" style={{ marginBottom: 0 }}>
        Round 1 (guerrilla, 3 FEs): surfaced validation error edge cases, photo capture friction, and SIM unlinking issues during breakfix. Round 2 (Dec 13, 14 FEs at Razorpay office): all feedback actioned — SIM scan made secondary, progress bar reduced in prominence, &ldquo;RRN&rdquo; renamed to &ldquo;Transaction Number&rdquo;, priority badge added, photo upload redesigned with stronger tap affordance.
      </p>
    </div>
  );
}

/* ── Slides 23–26 — Solution surfaces — descriptions verbatim from Layout A ── */
function SlideSurface({ name }: { name: string }) {
  const surfaces: Record<string, {
    surfaceNum: string;
    role: string;
    title: string;
    paragraphs: string[];
    slides: typeof getStartedSlides;
  }> = {
    "get-started": {
      surfaceNum: "Surface 1",
      role: "Start of day",
      title: "Login, Attendance & Ticket Homepage",
      paragraphs: [
        "FEs open the app to a personalised greeting, see their full ticket count and type breakdown, then mark attendance via a deliberate swipe — making the start of the workday feel intentional. The homepage shows every ticket with colour-coded type, TAT status (Overdue / 1 day left / 2 days left), distance, and estimated travel time. Device and SIM inventory is visible at a glance, eliminating mismatches before an agent even leaves for their first visit. No more WhatsApp lists. No more paper notes.",
      ],
      slides: getStartedSlides,
    },
    "installation": {
      surfaceNum: "Surface 2",
      role: "Core flow",
      title: "Installation: Scan, Map and Close",
      paragraphs: [
        "The biggest workflow unlock. One ticket now contains multiple TIDs. All merchant and device details are pre-populated — the agent confirms, scans, and proceeds. Barcode scanning is the primary input for device serial numbers; manual entry is the fallback. SIM numbers are manual-first (80–90% of SIM barcodes are absent in the field). A celebratory animation plays after each device maps: “TID 1 of 2 mapped successfully!” — a moment of delight in a repetitive flow.",
        "Compliance is baked in, not bolted on. The feature & device checklist ensures training is verified. Photo categories (shop board, inside view, device back) are mandatory and contextual. A single merchant OTP covers all devices in the ticket, replacing the old per-device WhatsApp flow. The closure screen digitally replaces the physical DSC form.",
      ],
      slides: installationSlides,
    },
    "deactivation": {
      surfaceNum: "Surface 3",
      role: "Device removal",
      title: "Deactivation: Unmap and Collect",
      paragraphs: [
        "Deactivation mirrors the installation flow in reverse. The FE scans each device to confirm identity, marks its status (working / not working / missing), and collects accessories — all within a single ticket flow. The device status log creates an audit trail that directly addresses the 8,000 device loss problem from the old stack. One merchant OTP at the end covers all unmapped devices, and the completion screen saves a deactivation copy for records.",
      ],
      slides: deactivationSlides,
    },
    "servicing": {
      surfaceNum: "Surface 4",
      role: "Device swap",
      title: "Servicing: Deactivation into Installation, in one ticket",
      paragraphs: [
        "Servicing is a device swap: the old device is collected and unmapped, then a replacement is installed and mapped — all within the same ticket. The app sequences this naturally: Phase 1 runs the full deactivation flow (scan to confirm old device, mark status, collect accessories), and Phase 2 runs the full installation flow (scan new serial, SIM entry, test transaction, photo upload, merchant OTP). No duplicate data entry. One ticket closure covers both.",
      ],
      slides: servicingSlides,
    },
  };

  const surf = surfaces[name];
  return (
    <div className="cs1-si">
      <div
        className="cs1-slide-label"
        style={{ display: "flex", alignItems: "center", gap: 10 }}
      >
        <span>{surf.surfaceNum}</span>
        <span style={{ color: "var(--cs-dim)" }}>&middot;</span>
        <span style={{ color: "var(--cs-dim)" }}>{surf.role}</span>
      </div>
      <h2 className="cs1-slide-h">{surf.title}</h2>
      {surf.paragraphs.map((p, i) => (
        <p key={i} className="cs1-slide-p">{p}</p>
      ))}
      <div className="cs1-surface-phone" style={{ marginTop: 8 }}>
        <PhoneSlideshow slides={surf.slides} />
      </div>
    </div>
  );
}

/* ── Slide 27 — Edge Cases — verbatim from Layout A Surface 5 ── */
function SlideEdgeCases() {
  return (
    <div className="cs1-si">
      <div
        className="cs1-slide-label"
        style={{ display: "flex", alignItems: "center", gap: 10 }}
      >
        <span>Surface 5</span>
        <span style={{ color: "var(--cs-dim)" }}>&middot;</span>
        <span style={{ color: "var(--cs-dim)" }}>Exception handling</span>
      </div>
      <h2 className="cs1-slide-h">Edge Cases: Revisit, Problematic<br />and Partial Transactions</h2>
      <p className="cs1-slide-p">
        Not every visit goes to plan. These flows handle the three most common exceptions, applicable across installation, deactivation, and servicing. Revisit is for merchant unavailability: the agent selects a reschedule date and reason, which gets logged and surfaced to the manager. Problematic is for permanent closures or wrong merchant flags, with contact details captured for an ops audit trail. Partial test transactions handles the edge case where a multi-device install has incomplete test txns — showing per-TID progress and allowing partial closure.
      </p>

      <div className="cs1-highlight" style={{ marginTop: 8, marginBottom: 16 }}>
        <div className="cs1-highlight-label">Edge case — Revisit</div>
        <p>Merchant not available? FE selects a reschedule date + reason; task moves back to queue with new TAT and prior context.</p>
      </div>
      <div className="cs1-surface-phone" style={{ marginBottom: 32 }}>
        <PhoneSlideshow slides={revisitSlides} />
      </div>

      <div className="cs1-highlight" style={{ marginTop: 0, marginBottom: 16 }}>
        <div className="cs1-highlight-label">Edge case — Problematic</div>
        <p>Permanent closure or wrong merchant? FE escalates with context; back-office resolves, FE gets notified, ticket disappears from queue until actionable.</p>
      </div>
      <div className="cs1-surface-phone">
        <PhoneSlideshow slides={problematicSlides} />
      </div>
    </div>
  );
}

/* ── Slide 20 — Outcome Stats — H2 + intro + 4 stat cards + 6 bullets.
   Verbatim from Layout A section 06's data block. ── */
function SlideOutcomeStats() {
  return (
    <div className="cs1-si">
      <div className="cs1-slide-label">Outcome &middot; Impact</div>
      <h2 className="cs1-slide-h">Shipped to all 276 agents across India in May 2025.<br />Here is what the data showed.</h2>
      <p className="cs1-slide-p">
        Launched to all 276 agents Pan-India on May 20, 2025. Impact assessed across pre-period (May 12–25) and post-period (May 26–June 6).
      </p>

      <div className="cs1-stat-grid" style={{ marginTop: 24, marginBottom: 24 }}>
        {[
          ["+12.5%", "Tickets closed per day — 1,227 → 1,380"],
          ["−57%",   "De-installation time — 4.82 days → 2.07 days"],
          ["+13.9%", "Agent productivity — 4.6 → 5.3 tickets/agent/day"],
          ["40%+",   "Adoption in 1 day across all 276 agents on Pan-India rollout"],
        ].map(([num, label]) => (
          <div className="cs1-stat" key={num}>
            <div className="cs1-stat-n">{num}</div>
            <div className="cs1-stat-l">{label}</div>
          </div>
        ))}
      </div>

      <ul
        style={{
          margin: 0,
          paddingLeft: 20,
          fontSize: 14,
          lineHeight: 1.7,
          color: "var(--cs-muted)",
        }}
      >
        <li>Avg ticket closure: <strong style={{ color: "var(--cs-text)" }}>2.9 days → 1.9 days</strong>, trending toward 1.5–1.6 days in June</li>
        <li>Top-quartile agents (Q4): 8.8 → 11.5 tickets/day — <strong style={{ color: "var(--cs-text)" }}>30.3% improvement</strong></li>
        <li>Service violations within 7 days of closure: <strong style={{ color: "var(--cs-text)" }}>16.5% → 5.9%</strong> (−10.6pp)</li>
        <li>₹24 lakh/year saved by eliminating the Asti vendor</li>
        <li>Additional ₹60 lakh/year expected once SAP B1 → SAP HANA migration completes</li>
        <li>100% of new-bank QR activations now run through the unified app</li>
      </ul>
    </div>
  );
}

/* ── Slide 21 — Reflections — What worked / What I'd do differently.
   Split off the outcome stats slide so each topic gets its own breathing room. ── */
function SlideReflections() {
  return (
    <div className="cs1-si">
      <div className="cs1-slide-label">Outcome &middot; Reflections</div>
      <h2 className="cs1-slide-h">What I&rsquo;d carry forward,<br />and what I&rsquo;d do differently</h2>
      <p className="cs1-slide-p">
        A few things that made this project work — and a few things I&rsquo;d push harder on if I were to do it again.
      </p>

      <div
        style={{
          marginTop: 28,
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 16,
        }}
      >
        <div
          style={{
            border: "1px solid var(--cs-border)",
            borderRadius: 8,
            padding: 24,
            background: "var(--cs-bg)",
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--cs-text)", marginBottom: 14 }}>What worked</div>
          <ul style={{ margin: 0, paddingLeft: 18, color: "var(--cs-muted)", fontSize: 14, lineHeight: 1.7 }}>
            <li>Field visits before the first wireframe — notepads and service forms were the real design brief</li>
            <li>Every decision traced to something seen or heard on those field visits</li>
            <li>Treating the app as consumer-grade, not a utility tool, drove trust</li>
            <li>40% of agents adopted it in a single day</li>
          </ul>
        </div>
        <div
          style={{
            border: "1px solid var(--cs-border)",
            borderRadius: 8,
            padding: 24,
            background: "var(--cs-bg)",
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--cs-text)", marginBottom: 14 }}>What I&rsquo;d do differently</div>
          <ul style={{ margin: 0, paddingLeft: 18, color: "var(--cs-muted)", fontSize: 14, lineHeight: 1.7 }}>
            <li>Push harder for map/route planning in v1 — agents visited same locations twice</li>
            <li>Ticket aggregation by location was clearly needed but deprioritised to ship</li>
            <li>Prototype the multi-device scan interaction in code earlier — Figma hid the state complexity</li>
            <li>Surface interaction edge cases before committing to full frame sets</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
