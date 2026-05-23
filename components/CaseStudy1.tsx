"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SurfaceSlideshow from "./SurfaceSlideshow";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSwitch: () => void;
}

const SLIDES = [
  "Overview",
  "01 · Problem",
  "02 · Research",
  "03 · Exploration",
  "04 · Solution",
  "05 · User Testing",
  "06 · Outcome",
];

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "55%" : "-55%",
    opacity: 0,
    filter: "blur(6px)",
  }),
  center: { x: 0, opacity: 1, filter: "blur(0px)" },
  exit: (dir: number) => ({
    x: dir < 0 ? "55%" : "-55%",
    opacity: 0,
    filter: "blur(6px)",
  }),
};

export default function CaseStudy1({ isOpen, onClose, onSwitch }: Props) {
  const [slide, setSlide] = useState(0);
  const [dir, setDir] = useState(1);
  const slideIdxRef = useRef(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const lastAdvanceRef = useRef(0);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    if (!isOpen) { setSlide(0); slideIdxRef.current = 0; }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) window.history.pushState({ overlay: "cs1" }, "");
  }, [isOpen]);

  useEffect(() => {
    const onPop = () => onClose();
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [onClose]);

  const go = useCallback((direction: number) => {
    const next = slideIdxRef.current + direction;
    if (next < 0 || next >= SLIDES.length) return;
    setDir(direction);
    setSlide(next);
    slideIdxRef.current = next;
  }, []);

  const goTo = useCallback((index: number) => {
    const d = index > slideIdxRef.current ? 1 : -1;
    setDir(d);
    setSlide(index);
    slideIdxRef.current = index;
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  /* Scroll-to-advance: accumulate delta at boundary, advance only when intentional */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const THRESHOLD = 220;   // px of accumulated scroll needed to advance
    const RESET_MS  = 400;   // ms of inactivity resets the accumulator

    let accumulated = 0;
    let resetTimer: ReturnType<typeof setTimeout> | null = null;

    const onWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastAdvanceRef.current < 800) return; // post-advance cooldown

      const slideEl = stage.querySelector<HTMLElement>(".cs1-slide");
      if (!slideEl) return;

      const atBottom = slideEl.scrollTop + slideEl.clientHeight >= slideEl.scrollHeight - 6;
      const atTop    = slideEl.scrollTop <= 0;
      const scrollingDown = e.deltaY > 0;
      const scrollingUp   = e.deltaY < 0;

      const atBoundary = (scrollingDown && atBottom) || (scrollingUp && atTop);

      if (!atBoundary) {
        // Not at boundary — let slide scroll, reset accumulator
        accumulated = 0;
        if (resetTimer) clearTimeout(resetTimer);
        return;
      }

      e.preventDefault();

      accumulated += Math.abs(e.deltaY);

      // Reset accumulator if user pauses
      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(() => { accumulated = 0; }, RESET_MS);

      if (accumulated >= THRESHOLD) {
        accumulated = 0;
        if (resetTimer) clearTimeout(resetTimer);
        lastAdvanceRef.current = now;
        go(scrollingDown ? 1 : -1);
      }
    };

    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      stage.removeEventListener("wheel", onWheel);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, [go]);

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
            <div className="cs1-ph-title">Downtime Dashboard 2.0</div>
            <div className="cs1-ph-counter">
              {slide + 1} <span>/ {SLIDES.length}</span>
            </div>
          </header>

          {/* ── Stage ── */}
          <div className="cs1-ps" ref={stageRef}>
            <AnimatePresence custom={dir} mode="wait">
              <motion.div
                key={slide}
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.42, ease: [0.25, 1, 0.3, 1] }}
                className="cs1-slide"
              >
                <SlideContent index={slide} />
              </motion.div>
            </AnimatePresence>

            {slide > 0 && (
              <button className="cs1-arrow cs1-arrow-prev" onClick={() => go(-1)} aria-label="Previous slide">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
            {slide < SLIDES.length - 1 && (
              <button className="cs1-arrow cs1-arrow-next" onClick={() => go(1)} aria-label="Next slide">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>

          {/* ── Footer ── */}
          <footer className="cs1-pf">
            <div className="cs1-pf-dots">
              {SLIDES.map((label, i) => (
                <button
                  key={i}
                  className={`cs1-pdot${i === slide ? " active" : ""}`}
                  onClick={() => goTo(i)}
                  title={label}
                >
                  <span className="cs1-pdot-label">{label}</span>
                </button>
              ))}
            </div>
            <button className="cs1-pf-switch" onClick={onSwitch}>
              View Layout B
            </button>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SlideContent({ index }: { index: number }) {
  switch (index) {
    case 0: return <SlideOverview />;
    case 1: return <SlideProblem />;
    case 2: return <SlideResearch />;
    case 3: return <SlideExploration />;
    case 4: return <SlideSolution />;
    case 5: return <SlideTesting />;
    case 6: return <SlideOutcome />;
    default: return null;
  }
}

function SlideOverview() {
  return (
    <div className="cs1-si cs1-si--cover">
      <div className="cs1-tag">Razorpay &middot; 2025 &middot; Product Design</div>
      <h1 className="cs1-cover-h">
        Downtime<br /><em>Dashboard 2.0</em>
      </h1>
      <p className="cs1-cover-hook">
        Merchants were discovering payment failures 2&ndash;4 hours late, through customer
        complaints, while Razorpay was quietly rerouting traffic and saving transactions they
        never knew about. The trust gap was costing us 2,266 support tickets every month.
      </p>
      <div className="cs1-meta">
        {[
          ["My Role", "Lead Product Designer"],
          ["Timeline", "May – Nov 2025"],
          ["Target", "3,900+ merchants"],
          ["Platform", "Web (responsive)"],
        ].map(([label, val]) => (
          <div className="cs1-meta-cell" key={label}>
            <div className="cs1-meta-label">{label}</div>
            <div className="cs1-meta-val">{val}</div>
          </div>
        ))}
      </div>
      <div className="cs1-owned">
        <div className="cs1-owned-label">What I owned</div>
        <p>End-to-end design from discovery to shipped: research planning and synthesis, information architecture across three surfaces, all interaction and visual design, usability testing design and facilitation, and stakeholder alignment with Co-founder and CPO.</p>
      </div>
    </div>
  );
}

function SlideProblem() {
  return (
    <div className="cs1-si">
      <div className="cs1-slide-label">01 &middot; Problem Space</div>
      <h2 className="cs1-slide-h">
        Merchants were flying blind,<br />and Razorpay&rsquo;s intelligence was invisible
      </h2>
      <p className="cs1-slide-p">
        When a bank, card network, or UPI provider went down, merchants had no way to know <strong>why</strong> — or even <strong>that it was happening</strong> — until customers started complaining. While merchants panicked, Razorpay&rsquo;s systems were actively rerouting traffic, switching gateways, and saving transactions. Merchants never saw this.
      </p>
      <div className="cs1-stat-grid">
        {[
          ["2,266", "Support tickets per month asking \u201cwhy are my payments failing?\u201d"],
          ["5–10%", "Of incidents communicated proactively. 90% were merchant-reported"],
          ["2–4 hrs", "Average lag from detection to merchant notification"],
          ["40%", "Customer retry rate after failure. 60% of GMV is irrecoverable"],
        ].map(([num, label]) => (
          <div className="cs1-stat" key={num}>
            <div className="cs1-stat-n">{num}</div>
            <div className="cs1-stat-l">{label}</div>
          </div>
        ))}
      </div>
      <p className="cs1-slide-p cs1-slide-p--sm">
        The competitive urgency: Juspay had real-time outage detection, Slack/Jira alerts, and impact metrics. Stripe had visual health dashboards with ML-powered anomaly detection. Razorpay&rsquo;s setup was fragmented, manual, and creating churn risk.
      </p>
    </div>
  );
}

function SlideResearch() {
  return (
    <div className="cs1-si">
      <div className="cs1-slide-label">02 &middot; Research</div>
      <h2 className="cs1-slide-h">Five personas, two research rounds, one north star</h2>
      <div className="cs1-persona-row">
        {[
          ["Payment Ops", "Triage & monitoring"],
          ["Tech Lead", "Root cause & code"],
          ["CX Lead", "Customer impact"],
          ["PM / PO", "Strategy & reports"],
          ["Business Head", "Revenue & risk"],
        ].map(([name, sub]) => (
          <div className="cs1-persona" key={name}>
            <div className="cs1-persona-n">{name}</div>
            <div className="cs1-persona-s">{sub}</div>
          </div>
        ))}
      </div>
      <div className="cs1-quotes">
        <blockquote className="cs1-bq">
          <p>&ldquo;Alerts are useless without specific data, like &lsquo;23% failure rate on Visa, affecting 1,200 transactions.&rsquo;&rdquo;</p>
          <cite>Nykaa, merchant interview</cite>
        </blockquote>
        <blockquote className="cs1-bq">
          <p>&ldquo;We need a downtime calendar, quick alerts, and tools to nudge customers back — otherwise it&rsquo;s just lost revenue.&rdquo;</p>
          <cite>Simplilearn, merchant interview</cite>
        </blockquote>
      </div>
      <div className="cs1-north-star">
        <div className="cs1-ns-label">North Star</div>
        <div className="cs1-ns-text">&ldquo;The merchant should feel calm, confident, and in control when a payment method or terminal goes down.&rdquo;</div>
      </div>
      <p className="cs1-slide-p cs1-slide-p--sm" style={{ marginTop: 20 }}>
        <strong>The reframe:</strong> This wasn&rsquo;t an alerting problem. It was a <em>trust and visibility</em> problem.
      </p>
    </div>
  );
}

function SlideExploration() {
  return (
    <div className="cs1-si">
      <div className="cs1-slide-label">03 &middot; Exploration</div>
      <h2 className="cs1-slide-h">Three directions explored,<br />one concept no competitor had</h2>
      <div className="cs1-dirs">
        {[
          {
            letter: "A", title: "Alert-first flow", killed: true,
            desc: "Richer notification centre extending the downtime dashboard. Alerts and dashboards serve different moments — conflating them weakened both.",
            verdict: "Killed — wrong mental model",
          },
          {
            letter: "B", title: "Standalone revamped dashboard", killed: true,
            desc: "Better filters, personalisation, impact metrics. Failed on a key finding: merchants don't go to the Downtime Dashboard when SR drops — they go to the Transactions Dashboard.",
            verdict: "Killed — requires habits merchants hadn't formed",
          },
          {
            letter: "C", title: "Contextual injection + Health module", killed: false,
            desc: "Bring the data to where merchants already were. Attribution in Transactions Dashboard. Overlays on InsightX. Inline tags in Support Chat. Approved by Co-founder and CPO.",
            verdict: "Chosen — meets merchants in their moment of pain",
          },
        ].map(({ letter, title, desc, verdict, killed }) => (
          <div className={`cs1-dir ${killed ? "cs1-dir--killed" : "cs1-dir--chosen"}`} key={letter}>
            <div className="cs1-dir-letter">{letter}</div>
            <div className="cs1-dir-body">
              <div className="cs1-dir-title">{title}</div>
              <div className="cs1-dir-desc">{desc}</div>
              <div className="cs1-dir-verdict">{killed ? "✕" : "✓"} {verdict}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="cs1-highlight">
        <div className="cs1-highlight-label">Standout concept — Blueprint Visualizer</div>
        <p>A live map of the merchant&rsquo;s unique terminal-method configuration with colour-coded health nodes, showing Razorpay rerouting traffic in real time. No competitor had this.</p>
      </div>
    </div>
  );
}

function SlideSolution() {
  return (
    <div className="cs1-si">
      <div className="cs1-slide-label">04 &middot; Solution</div>
      <h2 className="cs1-slide-h">A three-surface system:<br />6-hour anxiety to 5-minute clarity</h2>
      <p className="cs1-slide-p">
        Seven components across three surfaces, each serving a different moment in the merchant&rsquo;s debugging journey — from the first signal of a drop, to diagnosis, to post-mortem.
      </p>
      {[
        {
          num: "Surface 1", role: "Entry point", title: "Transactions Dashboard",
          desc: "When an SR drop occurs, the first place a merchant goes is Transactions. An anomaly banner surfaces the moment a significant failure cluster is detected. Failed transactions are auto-grouped by root cause — so \"is this us or Razorpay?\" is answered before the merchant even has to ask.",
          tag: "Transactions Dashboard — anomaly detection + root-cause attribution",
          slides: ["Screen 1 — Transactions summary with anomaly alert banner", "Screen 2 — Failed transactions grouped by root cause", "Screen 3 — Transaction detail with downtime attribution"],
        },
        {
          num: "Surface 2", role: "Diagnostic layer", title: "Downtime Dashboard",
          desc: "The default \u201cImpacting Me\u201d view filters to the merchant\u2019s active payment methods only. The Blueprint Visualizer shows a live map of their terminal-method configuration with colour-coded health nodes, making Razorpay\u2019s rerouting activity visible in real time.",
          tag: "Downtime Dashboard — Impacting Me view + Blueprint Visualizer",
          slides: ["Screen 1 — Impacting Me view", "Screen 2 — Blueprint Visualizer", "Screen 3 — Incident detail", "Screen 4 — Planned downtime calendar"],
        },
        {
          num: "Surface 3", role: "Post-mortem layer", title: "InsightX Integration",
          desc: "After an incident, leadership wants to know: how much GMV did we lose? We overlaid downtime events directly onto SR trend graphs — making causal links between incidents and revenue dips visible without leaving the analytics surface.",
          tag: "InsightX — downtime events overlaid on SR trend graphs",
          slides: ["Screen 1 — SR trend graph with downtime event overlays", "Screen 2 — Vendor performance breakdown"],
        },
      ].map(({ num, role, title, desc, tag, slides }) => (
        <div className="cs1-surface" key={num}>
          <div className="cs1-surface-meta">
            <span className="cs1-surface-num">{num}</span>
            <span className="cs1-surface-role">{role}</span>
          </div>
          <h3 className="cs1-surface-title">{title}</h3>
          <p className="cs1-slide-p cs1-slide-p--sm">{desc}</p>
          <SurfaceSlideshow tag={tag} slides={slides} />
        </div>
      ))}
    </div>
  );
}

function SlideTesting() {
  return (
    <div className="cs1-si">
      <div className="cs1-slide-label">05 &middot; Usability Testing</div>
      <h2 className="cs1-slide-h">Moderated sessions<br />across three merchant tiers</h2>
      <div className="cs1-tiers">
        {[
          { tier: "Primary", sessions: "4–5 sessions", title: "Funded Startups / EB", desc: "Bluestone, Banksaathi, JaipurKurti. No TAM, self-diagnose entirely. Highest unmet need.", primary: true },
          { tier: "Secondary", sessions: "2–3 sessions", title: "Managed Mid-Market", desc: "TAM-supported merchants, testing whether dashboard reduces escalation load even when support exists.", primary: false },
          { tier: "Tertiary", sessions: "1–2 sessions", title: "Enterprise", desc: "Nykaa, Decathlon, Urban Company. Testing API/webhook preferences and sophisticated monitoring needs.", primary: false },
        ].map(({ tier, sessions, title, desc, primary }) => (
          <div className={`cs1-tier${primary ? " cs1-tier--primary" : ""}`} key={tier}>
            <div className="cs1-tier-badge">{tier} &middot; {sessions}</div>
            <div className="cs1-tier-title">{title}</div>
            <div className="cs1-tier-desc">{desc}</div>
          </div>
        ))}
      </div>
      <blockquote className="cs1-bq cs1-bq--featured">
        <p>&ldquo;We need clickable cards that go directly to filtered transaction lists, and ETA tags — &lsquo;investigating, ETA 4h&rsquo; would save us from the chaos.&rdquo;</p>
        <cite>Vivek Mohan, Melora (~₹50K AOV fine jewellery) &middot; First completed UT session</cite>
      </blockquote>
      <div className="cs1-highlight">
        <div className="cs1-highlight-label">Priority finding from Melora session</div>
        <p>Reduce time-to-triage first: clickable cards linking to filtered transaction lists, failure-reason charts showing count and %, incident ETA tags. Then add recovery actions: bulk resend links, failover controls.</p>
      </div>
    </div>
  );
}

function SlideOutcome() {
  return (
    <div className="cs1-si">
      <div className="cs1-slide-label">06 &middot; Outcome &amp; Reflection</div>
      <h2 className="cs1-slide-h">Shipped October 2025.<br />Three signals define success.</h2>
      <p className="cs1-slide-p">
        Launched to 3,900+ Mid-Market and Emerging Business merchants in October 2025. The hypothesis: personalised, real-time downtime visibility integrated into existing workflows can cut debugging time from 6 hours to under 5 minutes.
      </p>
      <div className="cs1-outcome-grid">
        {[
          ["30–40%", "Target ticket reduction from dashboard-using cohorts"],
          ["< 5 min", "Target time-to-diagnosis, down from 6+ hours"],
          ["40%+", "Of impacted merchants to open dashboard during an SR drop"],
        ].map(([num, label]) => (
          <div className="cs1-outcome-stat" key={num}>
            <div className="cs1-outcome-n">{num}</div>
            <div className="cs1-outcome-l">{label}</div>
          </div>
        ))}
      </div>
      <div className="cs1-reflections">
        <div className="cs1-refl">
          <div className="cs1-refl-label">What I&rsquo;d do differently</div>
          <p>Push the InsightX integration into Phase 1. In every merchant interview, the SR graph was the first surface referenced when describing how they monitored for problems.</p>
        </div>
        <div className="cs1-refl">
          <div className="cs1-refl-label">What this project taught me</div>
          <p>The best design intervention isn&rsquo;t always a new surface. When you solve for trust and transparency rather than just information delivery, the product becomes something merchants rely on rather than ignore.</p>
        </div>
      </div>
    </div>
  );
}
