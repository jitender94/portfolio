"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SurfaceSlideshow from "./SurfaceSlideshow";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSwitch: () => void;
}

const SEC_IDS = ["cs1-s01", "cs1-s02", "cs1-s03", "cs1-s04", "cs1-s05", "cs1-s06"];

export default function CaseStudy1({ isOpen, onClose, onSwitch }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) { window.history.pushState({ overlay: "cs1" }, ""); }
  }, [isOpen]);

  useEffect(() => {
    const onPop = () => { onClose(); };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Progress bar scroll spy
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const onScroll = () => {
      const scrollTop = overlay.scrollTop;
      const headerH = overlay.querySelector<HTMLElement>(".ol-header")?.offsetHeight ?? 57;
      const progH = overlay.querySelector<HTMLElement>(".cs-progress")?.offsetHeight ?? 36;
      const offset = headerH + progH + 40;
      let current = SEC_IDS[0];
      SEC_IDS.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.offsetTop - offset <= scrollTop) current = id;
      });
      overlay.querySelectorAll<HTMLElement>(".cs-prog-step").forEach((step) => {
        const sec = step.getAttribute("data-sec") ?? "";
        step.classList.remove("current", "done");
        if (sec === current) step.classList.add("current");
        else if (SEC_IDS.indexOf(sec) < SEC_IDS.indexOf(current)) step.classList.add("done");
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
    const progH = overlay.querySelector<HTMLElement>(".cs-progress")?.offsetHeight ?? 36;
    overlay.scrollTo({ top: sec.offsetTop - headerH - progH - 16, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="overlay"
          id="cs1"
          ref={overlayRef}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] as [number,number,number,number] }}
        >
          <div className="ol-header">
            <button className="ol-back" onClick={onClose}>
              &larr; Back to portfolio
            </button>
            <div className="cs-layout-toggle">
              <button className="cs-layout-btn active">Layout A</button>
              <button className="cs-layout-btn" onClick={onSwitch}>Layout B</button>
            </div>
            <span className="ol-num">Case Study 01</span>
          </div>

          <div className="cs-progress">
            {["01 Problem", "02 Research", "03 Exploration", "04 Solution", "05 UT", "06 Outcome"].map(
              (label, i) => (
                <div
                  key={i}
                  className="cs-prog-step"
                  data-sec={`cs1-s0${i + 1}`}
                  onClick={() => scrollTo(`cs1-s0${i + 1}`)}
                >
                  {label}
                </div>
              )
            )}
          </div>

          <div className="ol-body">
            <div className="cs-tag">Razorpay &middot; 2025 &middot; Product Design</div>
            <div className="cs-title">Downtime<br /><em>Dashboard 2.0</em></div>
            <p className="cs-hook">
              Merchants were discovering payment failures 2&ndash;4 hours late, through customer
              complaints, while Razorpay was quietly rerouting traffic and saving transactions they
              never knew about. The trust gap was costing us 2,266 support tickets every month.
            </p>
            <div className="cs-meta">
              <div className="cs-meta-cell"><div className="cs-meta-label">My Role</div><div className="cs-meta-val">Lead Product Designer</div></div>
              <div className="cs-meta-cell"><div className="cs-meta-label">Timeline</div><div className="cs-meta-val">May &ndash; Nov 2025</div></div>
              <div className="cs-meta-cell"><div className="cs-meta-label">Target</div><div className="cs-meta-val">3,900+ merchants</div></div>
              <div className="cs-meta-cell"><div className="cs-meta-label">Platform</div><div className="cs-meta-val">Web (responsive)</div></div>
            </div>
            <div className="cs-callout" style={{ marginBottom: 48 }}>
              <div className="cs-callout-label">What I owned</div>
              <div className="cs-callout-text">End-to-end design from discovery to shipped: research planning and synthesis, information architecture across three surfaces, all interaction and visual design, usability testing design and facilitation, and stakeholder alignment with Co-founder and CPO.</div>
            </div>

            {/* Section 01 */}
            <div className="cs-sec" id="cs1-s01">
              <div className="cs-sec-header">
                <div><div className="cs-sec-label">01 &middot; Problem Space</div>
                <h3>Merchants were flying blind, and Razorpay&rsquo;s intelligence was invisible</h3></div>
              </div>
              <p>When a bank, card network, or UPI provider went down, merchants had no way to know <strong>why</strong> — or even <strong>that it was happening</strong> — until customers started complaining. In that 2&ndash;4 hour window, merchants continued processing failing transactions, paused campaigns, and raised tickets.</p>
              <div className="cs-callout">
                <div className="cs-callout-label">The invisible problem</div>
                <div className="cs-callout-text">While merchants panicked, Razorpay&rsquo;s systems were actively rerouting traffic, switching gateways, and saving transactions. Merchants never saw this. The intelligence was real. It was just invisible.</div>
              </div>
              <div className="cs-pill-row">
                <div className="cs-pill danger"><div className="cs-pill-num">2,266</div><div className="cs-pill-label">Support tickets per month asking &ldquo;why are my payments failing?&rdquo;</div></div>
                <div className="cs-pill danger"><div className="cs-pill-num">5&ndash;10%</div><div className="cs-pill-label">Of incidents communicated proactively. 90% were merchant-reported</div></div>
                <div className="cs-pill danger"><div className="cs-pill-num">2&ndash;4 hrs</div><div className="cs-pill-label">Average lag from detection to merchant notification</div></div>
                <div className="cs-pill danger"><div className="cs-pill-num">40%</div><div className="cs-pill-label">Customer retry rate after a failure. 60% is irrecoverable GMV</div></div>
              </div>
              <p>The competitive urgency was real: Juspay offered real-time outage detection, Slack/Jira alerts, and impact metrics. Stripe had visual health dashboards with ML-powered anomaly detection. Razorpay&rsquo;s setup was fragmented, manual, and creating churn risk.</p>
            </div>

            {/* Section 02 */}
            <div className="cs-sec" id="cs1-s02">
              <div className="cs-sec-header">
                <div><div className="cs-sec-label">02 &middot; Research</div>
                <h3>Five personas, two research rounds, one north star</h3></div>
              </div>
              <div className="cs-personas">
                {[["Payment Ops", "Triage & monitoring"], ["Tech Lead", "Root cause & code"], ["CX Lead", "Customer impact"], ["PM / PO", "Strategy & reports"], ["Business Head", "Revenue & risk"]].map(([name, sub]) => (
                  <div key={name} className="cs-persona"><div className="cs-persona-name">{name}</div><div className="cs-persona-sub">{sub}</div></div>
                ))}
              </div>
              <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--cs-dim)", letterSpacing: ".05em", marginTop: 4, marginBottom: 20 }}>Primary focus: Payment Ops Manager and Tech Lead. Secondary: PM and Business Head.</p>
              <p>Two merchant archetypes crystallised the problem. <strong>Zomato &amp; Blinkit</strong> act in real time. <strong>Titan</strong> reacts slowly. The gap wasn&rsquo;t capability — it was information access. <strong>The design question became: how do we make every merchant feel like they have an internal monitoring team?</strong></p>
              <div className="cs-bquote">
                <div className="cs-bquote-text">&ldquo;Alerts are useless without specific data, like &lsquo;23% failure rate on Visa, affecting 1,200 transactions.&rsquo;&rdquo;</div>
                <div className="cs-bquote-cite">Nykaa, merchant interview</div>
              </div>
              <p>Urban Company found out about a critical downtime from Twitter. Decathlon spent hours debugging their own code before realising it was an external gateway. MamaEarth discovered a major payment drop through customer complaints.</p>
              <div className="cs-callout">
                <div className="cs-callout-label">North Star</div>
                <div className="cs-callout-text">&ldquo;The merchant should feel calm, confident, and in control when a payment method or terminal goes down.&rdquo;</div>
              </div>
              <div className="cs-bquote">
                <div className="cs-bquote-text">&ldquo;We need a downtime calendar, quick alerts, and tools to nudge customers back — otherwise it&rsquo;s just lost revenue.&rdquo;</div>
                <div className="cs-bquote-cite">Simplilearn, merchant interview</div>
              </div>
              <p><strong>The reframe:</strong> This wasn&rsquo;t an alerting problem. It was a <em>trust and visibility</em> problem.</p>
            </div>

            {/* Section 03 */}
            <div className="cs-sec" id="cs1-s03">
              <div className="cs-sec-header">
                <div><div className="cs-sec-label">03 &middot; Exploration</div>
                <h3>Three directions explored, one concept no competitor had</h3></div>
              </div>
              <p>The core challenge: serve the panicking ops manager who just saw their SR drop, <em>and</em> the analyst doing quarterly reliability reviews, on the same product.</p>
              <div className="cs-directions">
                <div className="cs-dir killed">
                  <div className="cs-dir-letter">A</div>
                  <div className="cs-dir-body">
                    <div className="cs-dir-title">Alert-first flow</div>
                    <div className="cs-dir-desc">Richer notification centre extending the downtime dashboard. Alerts and dashboards serve different moments — conflating them weakened both.</div>
                    <div className="cs-dir-verdict">✕ Killed: wrong mental model</div>
                  </div>
                </div>
                <div className="cs-dir killed">
                  <div className="cs-dir-letter">B</div>
                  <div className="cs-dir-body">
                    <div className="cs-dir-title">Standalone revamped dashboard</div>
                    <div className="cs-dir-desc">Better filters, personalisation, impact metrics. Failed on a key finding: merchants don&rsquo;t go to the Downtime Dashboard when SR drops — they go to the Transactions Dashboard.</div>
                    <div className="cs-dir-verdict">✕ Killed: requires habits merchants hadn&rsquo;t formed</div>
                  </div>
                </div>
                <div className="cs-dir chosen">
                  <div className="cs-dir-letter">C</div>
                  <div className="cs-dir-body">
                    <div className="cs-dir-title">Contextual injection + Health module</div>
                    <div className="cs-dir-desc">Bring the data to where merchants already were. Attribution in Transactions Dashboard. Overlays on InsightX. Inline tags in Support Chat. Approved by Co-founder and CPO.</div>
                    <div className="cs-dir-verdict">✓ Chosen: meets merchants in their moment of pain</div>
                  </div>
                </div>
              </div>
              <div className="cs-callout">
                <div className="cs-callout-label">Standout concept — Blueprint Visualizer</div>
                <div className="cs-callout-text">A live map of the merchant&rsquo;s unique terminal-method configuration with colour-coded health nodes, showing Razorpay rerouting traffic in real time. No competitor had this.</div>
              </div>
              <div className="cs-ai-callout">
                <div className="cs-ai-callout-header">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.1"/><path d="M5 7.5 L6.2 8.7 L9 5.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span>AI-assisted exploration</span>
                </div>
                <p>Used AI prototyping to rapidly generate layout variations for the Blueprint Visualizer before committing to full Figma frames. This got us to something visual fast enough to share with Shashank and Khilan for early direction sign-off, before engineering had any involvement.</p>
                <div className="cs-ai-img"><span>Early AI-generated layout explorations — add screenshot here</span></div>
              </div>
            </div>

            {/* Section 04 */}
            <div className="cs-sec" id="cs1-s04">
              <div className="cs-sec-header">
                <div><div className="cs-sec-label">04 &middot; Solution</div>
                <h3>A three-surface system: 6-hour anxiety to 5-minute clarity</h3></div>
              </div>
              <p>The final design was built around seven components across three surfaces, each serving a different moment in the merchant&rsquo;s debugging journey — from the first signal of a drop, to diagnosis, to post-mortem.</p>

              {/* Surface 1 */}
              <div className="cs-v2-surface">
                <div className="cs-v2-surface-meta">
                  <span className="cs-v2-surface-num">Surface 1</span>
                  <span className="cs-v2-surface-role">Entry point</span>
                </div>
                <h3 className="cs-v2-surface-title">Transactions Dashboard</h3>
                <p>When an SR drop occurs, the first place a merchant goes is Transactions. So we met them there. An anomaly banner surfaces at the summary level the moment a significant failure cluster is detected. Failed transactions are auto-grouped by root cause — so the question &ldquo;is this us or Razorpay?&rdquo; is answered before the merchant even has to ask. A single click opens the attributed downtime incident, with full context already loaded.</p>
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
                <p>Once a merchant knows something is wrong, the Downtime Dashboard is where they diagnose it. The default &ldquo;Impacting Me&rdquo; view filters to the merchant&rsquo;s active payment methods only, ordered by business impact. The Blueprint Visualizer shows a live map of their unique terminal-method configuration with colour-coded health nodes, making Razorpay&rsquo;s rerouting activity visible in real time. A 365-day planned downtime calendar with self-service alert subscriptions removes the last remaining gap: advance notice.</p>
                <div className="cs-callout">
                  <div className="cs-callout-label">The most debated design decision</div>
                  <div className="cs-callout-text">Engineering wanted one comprehensive ecosystem view. We held personalisation as default. The argument was settled by a specific usability finding: merchants scanning the full ecosystem view took 40+ seconds to find their relevant downtime. The personalised view surfaced it in under 5.</div>
                </div>
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
                <p>After an incident, leadership wants to know: how much GMV did we lose? Which vendor was responsible? How does this month compare to last? InsightX is already where merchants go for these reviews. We overlaid downtime events directly onto SR trend graphs — making causal links between incidents and revenue dips visible without leaving the analytics surface. Built for leadership presentations, vendor performance reviews, and quarterly reporting.</p>
                <SurfaceSlideshow
                  tag="InsightX — downtime events overlaid on SR trend graphs"
                  slides={[
                    "Screen 1 — SR trend graph with downtime event overlays",
                    "Screen 2 — Vendor performance breakdown with incident history",
                  ]}
                />
              </div>
            </div>

            {/* Section 05 */}
            <div className="cs-sec" id="cs1-s05">
              <div className="cs-sec-header">
                <div><div className="cs-sec-label">05 &middot; Usability Testing</div>
                <h3>Moderated sessions across three merchant tiers</h3></div>
              </div>
              <p>Four areas validated before full rollout: personalised dashboard, new entry points, self-service alert configuration, and planned downtime calendar. 45&ndash;60 min moderated sessions over Google Meet with live prototype walkthroughs.</p>
              <div className="cs-ut-tiers">
                <div className="cs-tier cs-tier-primary">
                  <div className="cs-tier-badge">Primary &middot; 4&ndash;5 sessions</div>
                  <div className="cs-tier-title">Funded Startups / EB</div>
                  <div className="cs-tier-desc">Bluestone, Banksaathi, JaipurKurti. No TAM, self-diagnose entirely. Highest unmet need.</div>
                </div>
                <div className="cs-tier cs-tier-secondary">
                  <div className="cs-tier-badge">Secondary &middot; 2&ndash;3 sessions</div>
                  <div className="cs-tier-title">Managed Mid-Market</div>
                  <div className="cs-tier-desc">TAM-supported merchants, testing whether dashboard reduces escalation load even when support exists.</div>
                </div>
                <div className="cs-tier cs-tier-tertiary">
                  <div className="cs-tier-badge">Tertiary &middot; 1&ndash;2 sessions</div>
                  <div className="cs-tier-title">Enterprise</div>
                  <div className="cs-tier-desc">Nykaa, Decathlon, Urban Company. Testing API/webhook preferences and sophisticated monitoring needs.</div>
                </div>
              </div>
              <div className="cs-bquote">
                <div className="cs-bquote-text">&ldquo;We need clickable cards that go directly to filtered transaction lists, and ETA tags — &lsquo;investigating, ETA 4h&rsquo; would save us from the chaos.&rdquo;</div>
                <div className="cs-bquote-cite">Vivek Mohan, Melora (~₹50K AOV fine jewellery) · First completed UT session</div>
              </div>
              <div className="cs-callout">
                <div className="cs-callout-label">Priority finding from Melora session</div>
                <div className="cs-callout-text">Reduce time-to-triage first: clickable cards linking to filtered transaction lists, failure-reason charts showing count and %, incident ETA tags. Then add recovery actions: bulk resend links, failover controls.</div>
              </div>
              <div className="cs-ai-callout">
                <div className="cs-ai-callout-header">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.1"/><path d="M5 7.5 L6.2 8.7 L9 5.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span>AI-assisted validation</span>
                </div>
                <p>Used AI-generated mid-fidelity prototypes of the Downtime Detail Page during the Melora UT session. This let us test interaction logic with a real merchant before any production-ready designs existed, compressing a two-week cycle into two days.</p>
                <div className="cs-ai-img"><span>AI prototype used in Melora UT session — add screenshot here</span></div>
              </div>
            </div>

            {/* Section 06 */}
            <div className="cs-sec" id="cs1-s06">
              <div className="cs-sec-header">
                <div><div className="cs-sec-label">06 &middot; Outcome &amp; Reflection</div>
                <h3>Shipped October 2025. Three signals define success.</h3></div>
              </div>
              <p>Launched to 3,900+ Mid-Market and Emerging Business merchants in October 2025. The hypothesis: personalised, real-time downtime visibility integrated directly into existing merchant workflows can cut debugging time from 6 hours to under 5 minutes and reduce support tickets by 30&ndash;40%.</p>
              <div className="cs-pill-row">
                <div className="cs-pill"><div className="cs-pill-num">30&ndash;40%</div><div className="cs-pill-label">Target ticket reduction from dashboard-using cohorts</div></div>
                <div className="cs-pill"><div className="cs-pill-num">&lt;5 min</div><div className="cs-pill-label">Target time-to-diagnosis, down from 6+ hours</div></div>
                <div className="cs-pill"><div className="cs-pill-num">40%+</div><div className="cs-pill-label">Of impacted merchants to open dashboard during an SR drop</div></div>
              </div>
              <p>An early signal worth noting: in the first two weeks post-launch, several pilot merchants used the grouped transaction view to discover silent configuration errors they hadn&rsquo;t known about.</p>
              <p><strong>What I&rsquo;d do differently:</strong> Push the InsightX integration into Phase 1. In every merchant interview, the SR graph was the first surface referenced when describing how they monitored for problems.</p>
              <p><strong>What this project taught me:</strong> The best design intervention isn&rsquo;t always a new surface. Razorpay&rsquo;s intelligence was real. The design problem was making that intelligence visible. When you solve for trust and transparency rather than just information delivery, the product becomes something merchants rely on rather than ignore.</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
