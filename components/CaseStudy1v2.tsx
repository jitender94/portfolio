"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function SurfaceSlideshow({ tag, slides }: { tag: string; slides: string[] }) {
  const [active, setActive] = useState(0);
  const prev = () => setActive((a) => (a - 1 + slides.length) % slides.length);
  const next = () => setActive((a) => (a + 1) % slides.length);
  return (
    <div className="cs-slideshow">
      <div className="cs-slideshow-bar">
        <div className="cs-mockup-dots">
          <div className="cs-mockup-dot" style={{ background: "#e74c3c" }} />
          <div className="cs-mockup-dot" style={{ background: "#f39c12" }} />
          <div className="cs-mockup-dot" style={{ background: "#2ecc71" }} />
        </div>
        <div className="cs-slideshow-tag">{tag}</div>
        <div className="cs-slide-counter">{active + 1}&thinsp;/&thinsp;{slides.length}</div>
      </div>
      <div className="cs-slideshow-viewport">
        <div className="cs-slide-placeholder">
          <span>{slides[active]}</span>
        </div>
        {slides.length > 1 && (
          <>
            <button className="cs-slide-arrow cs-slide-prev" onClick={prev} aria-label="Previous">&#8592;</button>
            <button className="cs-slide-arrow cs-slide-next" onClick={next} aria-label="Next">&#8594;</button>
          </>
        )}
      </div>
      {slides.length > 1 && (
        <div className="cs-slide-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`cs-slide-dot${i === active ? " active" : ""}`}
              onClick={() => setActive(i)}
              aria-label={`Go to screen ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSwitch: () => void;
}

const SEC_IDS = ["c2-s01", "c2-s02", "c2-s03", "c2-s04", "c2-s05", "c2-s06"];
const NAV_LABELS = ["Brief", "Research", "Problem", "Ideation", "Solution", "Outcome"];

export default function CaseStudy1v2({ isOpen, onClose, onSwitch }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Sidebar scroll spy
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const onScroll = () => {
      const scrollTop = overlay.scrollTop;
      const headerH = overlay.querySelector<HTMLElement>(".ol-header")?.offsetHeight ?? 57;
      const offset = headerH + 60;
      let current = SEC_IDS[0];
      SEC_IDS.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.offsetTop - offset <= scrollTop) current = id;
      });
      overlay.querySelectorAll<HTMLElement>(".cs-v2-navitem").forEach((item) => {
        item.classList.toggle("active", item.getAttribute("data-sec") === current);
      });
    };
    overlay.addEventListener("scroll", onScroll);
    return () => overlay.removeEventListener("scroll", onScroll);
  }, [isOpen]);

  const scrollTo = (secId: string) => {
    const overlay = overlayRef.current;
    const sec = document.getElementById(secId);
    if (!overlay || !sec) return;
    const headerH = overlay.querySelector<HTMLElement>(".ol-header")?.offsetHeight ?? 57;
    overlay.scrollTo({ top: sec.offsetTop - headerH - 32, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="overlay"
          id="cs1v2"
          ref={overlayRef}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
        >
          {/* Header */}
          <div className="ol-header">
            <button className="ol-back" onClick={onClose}>
              &larr; Back to portfolio
            </button>
            <div className="cs-layout-toggle">
              <button className="cs-layout-btn" onClick={onSwitch}>Layout A</button>
              <button className="cs-layout-btn active">Layout B</button>
            </div>
            <span className="ol-num">Case Study 01</span>
          </div>

          {/* Cover — full width above sidebar */}
          <div className="cs-v2-cover">
            <div className="cs-v2-cover-img">
              <span>Cover Image</span>
            </div>
            <div className="cs-v2-cover-head">
              <div className="cs-tag">Razorpay &middot; 2025 &middot; Product Design</div>
              <h1 className="cs-v2-title">Downtime Dashboard 2.0</h1>
              <p className="cs-v2-hook">
                Merchants were discovering payment failures 2&ndash;4 hours late — through customer
                complaints — while Razorpay was quietly rerouting traffic and saving transactions
                they never knew about. The trust gap was costing 2,266 support tickets every month.
              </p>
            </div>
            <div className="cs-v2-overview">
              {[
                ["Role", "Lead Product Designer"],
                ["Duration", "May – Nov 2025"],
                ["Platform", "Web (responsive)"],
                ["Reach", "3,900+ merchants"],
              ].map(([k, v]) => (
                <div className="cs-v2-overview-item" key={k}>
                  <div className="cs-v2-overview-key">{k}</div>
                  <div className="cs-v2-overview-val">{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar + Content */}
          <div className="cs-v2-wrap">

            {/* Sticky sidebar nav */}
            <aside className="cs-v2-sidebar">
              <div className="cs-v2-sidenav-label">Contents</div>
              <ul className="cs-v2-sidenav">
                {NAV_LABELS.map((label, i) => (
                  <li
                    key={i}
                    className="cs-v2-navitem"
                    data-sec={SEC_IDS[i]}
                    onClick={() => scrollTo(SEC_IDS[i])}
                  >
                    <span className="cs-v2-navnum">0{i + 1}</span>
                    {label}
                  </li>
                ))}
              </ul>
            </aside>

            {/* Main content */}
            <div className="cs-v2-main">

              {/* 01 · Brief */}
              <div className="cs-sec-v2" id="c2-s01">
                <div className="cs-sec-v2-label">01 &middot; Brief</div>
                <h2 className="cs-sec-v2-h">When payment gateways fail, merchants need to know — but they didn&rsquo;t</h2>

                <p className="cs-sec p">When a bank, card network, or UPI provider went down, merchants had no way to know <strong>why</strong> — or even <strong>that it was happening</strong> — until customers started complaining. In that 2&ndash;4 hour window, merchants kept processing failing transactions, paused campaigns, and raised support tickets.</p>

                <div className="cs-stat-hero-row">
                  {[
                    ["2,266", "Support tickets per month asking \u201cwhy are my payments failing?\u201d"],
                    ["5–10%", "Of incidents communicated proactively. 90% were merchant-reported"],
                    ["2–4 hrs", "Average lag from detection to merchant notification"],
                    ["40%", "Customer retry rate after a failure. 60% is irrecoverable GMV"],
                  ].map(([num, label]) => (
                    <div className="cs-stat-hero" key={num}>
                      <div className="cs-stat-hero-num">{num}</div>
                      <div className="cs-stat-hero-label">{label}</div>
                    </div>
                  ))}
                </div>

                <p className="cs-sec p">While merchants panicked, Razorpay&rsquo;s systems were actively rerouting traffic, switching gateways, and saving transactions. Merchants never saw this. The intelligence was real. It was just invisible.</p>

                <p className="cs-sec p">The competitive urgency was real too: Juspay offered real-time outage detection, Slack/Jira alerts, and impact metrics. Stripe had visual health dashboards with ML-powered anomaly detection. Razorpay&rsquo;s setup was fragmented, manual, and creating churn risk.</p>
              </div>

              {/* 02 · Research */}
              <div className="cs-sec-v2" id="c2-s02">
                <div className="cs-sec-v2-label">02 &middot; Research</div>
                <h2 className="cs-sec-v2-h">Five personas, two research rounds, one reframe</h2>

                <div className="cs-personas" style={{ marginBottom: 28 }}>
                  {[
                    ["Payment Ops", "Triage & monitoring"],
                    ["Tech Lead", "Root cause & code"],
                    ["CX Lead", "Customer impact"],
                    ["PM / PO", "Strategy & reports"],
                    ["Business Head", "Revenue & risk"],
                  ].map(([name, sub]) => (
                    <div key={name} className="cs-persona">
                      <div className="cs-persona-name">{name}</div>
                      <div className="cs-persona-sub">{sub}</div>
                    </div>
                  ))}
                </div>

                <p className="cs-sec p">Two merchant archetypes crystallised the problem. <strong>Zomato &amp; Blinkit</strong> act in real time — they have the operational maturity to respond the moment an SR drop is spotted. <strong>Titan</strong> reacts slowly — they discover issues after customers escalate. The gap wasn&rsquo;t capability. It was information access.</p>

                <div className="cs-pullquote">
                  <div className="cs-pullquote-text">&ldquo;Alerts are useless without specific data, like &lsquo;23% failure rate on Visa, affecting 1,200 transactions.&rsquo;&rdquo;</div>
                  <div className="cs-pullquote-cite">Nykaa &mdash; merchant interview</div>
                </div>

                <p className="cs-sec p">Urban Company found out about a critical downtime from Twitter. Decathlon spent hours debugging their own code before realising it was an external gateway. MamaEarth discovered a major payment drop through customer complaints, not Razorpay.</p>

                <div className="cs-pullquote">
                  <div className="cs-pullquote-text">&ldquo;We need a downtime calendar, quick alerts, and tools to nudge customers back — otherwise it&rsquo;s just lost revenue.&rdquo;</div>
                  <div className="cs-pullquote-cite">Simplilearn &mdash; merchant interview</div>
                </div>
              </div>

              {/* 03 · Problem */}
              <div className="cs-sec-v2" id="c2-s03">
                <div className="cs-sec-v2-label">03 &middot; Problem</div>
                <h2 className="cs-sec-v2-h">This wasn&rsquo;t an alerting problem. It was a trust problem.</h2>

                <p className="cs-sec p">The initial brief was to improve the downtime alerting system. But the research revealed something different: merchants didn&rsquo;t lack alerts — they lacked context, confidence, and control. Getting a push notification that says &ldquo;gateway down&rdquo; is not useful when you don&rsquo;t know which transactions were affected, whether Razorpay is already on it, or when it will be resolved.</p>

                <div className="cs-v2-callout">
                  <div className="cs-v2-callout-label">North Star</div>
                  <div className="cs-v2-callout-text">&ldquo;The merchant should feel calm, confident, and in control when a payment method or terminal goes down.&rdquo;</div>
                </div>

                <p className="cs-sec p">The design question shifted: <em>How do we make every merchant feel like they have an internal monitoring team — without actually giving them one?</em></p>

                <p className="cs-sec p">This reframe changed everything. It meant the solution wasn&rsquo;t more alerts — it was making Razorpay&rsquo;s existing intelligence <strong>visible</strong>. The data existed. The rerouting was happening. Merchants just couldn&rsquo;t see it.</p>
              </div>

              {/* 04 · Ideation */}
              <div className="cs-sec-v2" id="c2-s04">
                <div className="cs-sec-v2-label">04 &middot; Ideation</div>
                <h2 className="cs-sec-v2-h">Three directions explored, one concept no competitor had</h2>

                <p className="cs-sec p">The core tension: serve the panicking ops manager who just saw their SR drop, <em>and</em> the analyst doing quarterly reliability reviews — on the same product, at the same time.</p>

                <div className="cs-v2-directions">
                  <div className="cs-v2-dir killed">
                    <div className="cs-v2-dir-letter">Direction A</div>
                    <div className="cs-v2-dir-title">Alert-first flow</div>
                    <div className="cs-v2-dir-desc">A richer notification centre extending the downtime dashboard. Killed early — alerts and dashboards serve different moments. Conflating them weakened both.</div>
                    <div className="cs-v2-dir-verdict">✕ Wrong mental model</div>
                  </div>
                  <div className="cs-v2-dir killed">
                    <div className="cs-v2-dir-letter">Direction B</div>
                    <div className="cs-v2-dir-title">Standalone revamped dashboard</div>
                    <div className="cs-v2-dir-desc">Better filters, personalisation, impact metrics. Failed on a key finding: merchants don&rsquo;t go to the Downtime Dashboard when SR drops — they go to Transactions.</div>
                    <div className="cs-v2-dir-verdict">✕ Requires habits merchants hadn&rsquo;t formed</div>
                  </div>
                  <div className="cs-v2-dir chosen" style={{ gridColumn: "1 / -1" }}>
                    <div className="cs-v2-dir-letter">Direction C &mdash; Chosen</div>
                    <div className="cs-v2-dir-title">Contextual injection + Health module</div>
                    <div className="cs-v2-dir-desc">Bring the data to where merchants already were. Attribution in Transactions Dashboard. Overlays on InsightX. Inline tags in Support Chat. Approved by Co-founder and CPO.</div>
                    <div className="cs-v2-dir-verdict">✓ Meets merchants in their moment of pain</div>
                  </div>
                </div>

                <p className="cs-sec p"><strong>Standout concept — Blueprint Visualizer:</strong> A live map of the merchant&rsquo;s unique terminal-method configuration with colour-coded health nodes, showing Razorpay rerouting traffic in real time. No competitor had this. Used AI prototyping to rapidly generate layout variations before committing to full Figma frames — getting to something visual fast enough to share with the Co-founder and CPO for early direction sign-off, before engineering had any involvement.</p>
              </div>

              {/* 05 · Solution */}
              <div className="cs-sec-v2" id="c2-s05">
                <div className="cs-sec-v2-label">05 &middot; Solution</div>
                <h2 className="cs-sec-v2-h">A three-surface system: 6-hour anxiety to 5-minute clarity</h2>
                <p className="cs-sec p">The final design was built around seven components across three surfaces, each serving a different moment in the merchant&rsquo;s debugging journey — from the first signal of a drop, to diagnosis, to post-mortem.</p>

                {/* Surface 1 */}
                <div className="cs-v2-surface">
                  <div className="cs-v2-surface-meta">
                    <span className="cs-v2-surface-num">Surface 1</span>
                    <span className="cs-v2-surface-role">Entry point</span>
                  </div>
                  <h3 className="cs-v2-surface-title">Transactions Dashboard</h3>
                  <p className="cs-sec p">When an SR drop occurs, the first place a merchant goes is Transactions. So we met them there. An anomaly banner surfaces at the summary level the moment a significant failure cluster is detected. Failed transactions are auto-grouped by root cause — so the question &ldquo;is this us or Razorpay?&rdquo; is answered before the merchant even has to ask. A single click opens the attributed downtime incident, with full context already loaded.</p>
                  <SurfaceSlideshow
                    tag="Transactions Dashboard — anomaly detection + root-cause attribution"
                    slides={[
                      "Screen 1 — Transactions summary with anomaly alert banner",
                      "Screen 2 — Failed transactions grouped by root cause",
                      "Screen 3 — Transaction detail with downtime attribution",
                    ]}
                  />
                </div>

                {/* Surface 2 */}
                <div className="cs-v2-surface">
                  <div className="cs-v2-surface-meta">
                    <span className="cs-v2-surface-num">Surface 2</span>
                    <span className="cs-v2-surface-role">Diagnostic layer</span>
                  </div>
                  <h3 className="cs-v2-surface-title">Downtime Dashboard</h3>
                  <p className="cs-sec p">Once a merchant knows something is wrong, the Downtime Dashboard is where they diagnose it. The default view — &ldquo;Impacting Me&rdquo; — filters to the merchant&rsquo;s active payment methods only, ordered by business impact. The Blueprint Visualizer shows a live map of their unique terminal-method configuration with colour-coded health nodes, making Razorpay&rsquo;s rerouting activity visible in real time. A 365-day planned downtime calendar with self-service alert subscriptions removes the last remaining gap: advance notice.</p>
                  <p className="cs-sec p"><strong>The most debated design decision:</strong> Engineering wanted one comprehensive ecosystem view. We held personalisation as default — a specific usability finding settled it. Merchants scanning the full ecosystem view took 40+ seconds to find their relevant downtime. The personalised view surfaced it in under 5.</p>
                  <SurfaceSlideshow
                    tag="Downtime Dashboard — Impacting Me view + Blueprint Visualizer"
                    slides={[
                      "Screen 1 — Impacting Me view, filtered to merchant's active methods",
                      "Screen 2 — Blueprint Visualizer — live terminal-method health map",
                      "Screen 3 — Incident detail with impact timeline and resolution status",
                      "Screen 4 — Planned downtime calendar with alert subscription",
                    ]}
                  />
                </div>

                {/* Surface 3 */}
                <div className="cs-v2-surface">
                  <div className="cs-v2-surface-meta">
                    <span className="cs-v2-surface-num">Surface 3</span>
                    <span className="cs-v2-surface-role">Post-mortem layer</span>
                  </div>
                  <h3 className="cs-v2-surface-title">InsightX Integration</h3>
                  <p className="cs-sec p">After an incident, leadership wants to know: how much GMV did we lose? Which vendor was responsible? How does this month compare to last? InsightX is already where merchants go for these reviews. We overlaid downtime events directly onto SR trend graphs — making causal links between incidents and revenue dips visible without leaving the analytics surface. Built for leadership presentations, vendor performance reviews, and quarterly reporting.</p>
                  <SurfaceSlideshow
                    tag="InsightX — downtime events overlaid on SR trend graphs"
                    slides={[
                      "Screen 1 — SR trend graph with downtime event overlays",
                      "Screen 2 — Vendor performance breakdown with incident history",
                    ]}
                  />
                </div>
              </div>

              {/* 06 · Outcome */}
              <div className="cs-sec-v2" id="c2-s06">
                <div className="cs-sec-v2-label">06 &middot; Outcome</div>
                <h2 className="cs-sec-v2-h">Shipped October 2025. Three signals define success.</h2>

                <p className="cs-sec p">Launched to 3,900+ Mid-Market and Emerging Business merchants in October 2025.</p>

                <div className="cs-stat-hero-row" style={{ marginBottom: 40 }}>
                  {[
                    ["30–40%", "Target ticket reduction from dashboard-using cohorts"],
                    ["< 5 min", "Target time-to-diagnosis, down from 6+ hours"],
                    ["40%+", "Of impacted merchants to open dashboard during an SR drop"],
                  ].map(([num, label]) => (
                    <div className="cs-stat-hero" key={num}>
                      <div className="cs-stat-hero-num">{num}</div>
                      <div className="cs-stat-hero-label">{label}</div>
                    </div>
                  ))}
                </div>

                <p className="cs-sec p">An early signal worth noting: in the first two weeks post-launch, several pilot merchants used the grouped transaction view to discover silent configuration errors they hadn&rsquo;t known about — issues that had been silently bleeding revenue for months.</p>

                <div className="cs-v2-reflect">
                  <div className="cs-v2-reflect-item">
                    <div className="cs-v2-reflect-label">What I&rsquo;d do differently</div>
                    <p>Push the InsightX integration into Phase 1. In every merchant interview, the SR graph was the first surface referenced when describing how they monitored for problems. We should have started there.</p>
                  </div>
                  <div className="cs-v2-reflect-item">
                    <div className="cs-v2-reflect-label">What this project taught me</div>
                    <p>The best design intervention isn&rsquo;t always a new surface. Razorpay&rsquo;s intelligence was real. The design problem was making that intelligence visible. When you solve for trust and transparency rather than just information delivery, the product becomes something merchants rely on rather than ignore.</p>
                  </div>
                </div>
              </div>

            </div>{/* /cs-v2-main */}
          </div>{/* /cs-v2-wrap */}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
