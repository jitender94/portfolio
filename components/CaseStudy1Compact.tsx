"use client";

/**
 * CaseStudy1Compact — Visual / scannable version of the Downtime Dashboard case study.
 * Exported as a single function: CompactSlideContent({ index })
 * Indexes match exactly with CaseStudy1.tsx's SLIDES array (21 total).
 * Hero slides (1, 4, 7, 12, 15) are handled by CaseStudy1.tsx itself (shared).
 */

import SurfaceSlideshow from "./SurfaceSlideshow";

/* ─── Shared tiny helpers ─── */

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="cs1c-tag">{children}</span>;
}

function BigNum({ n, label }: { n: string; label: string }) {
  return (
    <div className="cs1c-bignum">
      <div className="cs1c-bignum-n">{n}</div>
      <div className="cs1c-bignum-l">{label}</div>
    </div>
  );
}

/* ─── Router ─── */

export function CompactSlideContent({ index }: { index: number }) {
  switch (index) {
    case  0: return <COverview />;
    /* 1 = Context hero — rendered by parent */
    case  2: return <CMerchantStory />;
    case  3: return <CWhatIsDowntime />;
    /* 4 = Problem hero — rendered by parent */
    case  5: return <CBizProblems />;
    case  6: return <CUserProblems />;
    /* 7 = Research hero — rendered by parent */
    case  8: return <CCurrentExp />;
    case  9: return <CDataAttribution />;
    case 10: return <CHMW />;
    case 11: return <CVision />;
    /* 12 = Design hero — rendered by parent */
    case 13: return <CIterations />;
    case 14: return <CTesting />;
    /* 15 = Solution hero — rendered by parent */
    case 16: return <CSolutionTx />;
    case 17: return <CSolutionDetail />;
    case 18: return <CDowntimeHomepage />;
    case 19: return <CJourney />;
    case 20: return <COutcome />;
    default: return null;
  }
}

/* ════════════════════════════════════════════════════
   COMPACT SLIDES
════════════════════════════════════════════════════ */

/* ── 0 · Overview ── */
function COverview() {
  return (
    <div className="cs1-si cs1c-slide">
      {/* Tag line */}
      <div className="cs1-tag">Razorpay &middot; 2025 &middot; Product Design</div>

      {/* Hero — title + hook left, mockup right */}
      <div className="cs1c-hero-row">
        <div className="cs1c-hero-text">
          <h1 className="cs1c-cover-h">Ecosystem health,<br /><em>downtimes &amp; alerting</em></h1>
          <p className="cs1c-hook">
            When payment <strong>failures spike</strong>, <strong>merchants panic</strong>.{" "}
            They <strong>escalate to POCs</strong>/Support and <strong>wait 6+&nbsp;hours</strong>{" "}
            in anxiety&mdash;wondering <strong>what is broken</strong> &ndash; Is it Razorpay or issuer banks or network.
          </p>
          <p className="cs1c-hook" style={{ marginBottom: 0 }}>
            We receive <strong>17K+</strong> such <strong>tickets</strong> annually. Meanwhile,
            merchants can&apos;t decide next action without issue isolation.
          </p>
        </div>
        <div className="cs1c-hero-img-wrap">
          <img
            src="/cs1/hero_image.png"
            alt="Ecosystem Health Dashboard — downtime detail view"
            className="cs1c-hero-img"
          />
        </div>
      </div>

      {/* Meta row: role / timeline / reach / platform */}
      <div className="cs1c-meta-row">
        {[
          ["Role",     "Lead Product Designer"],
          ["Timeline", "May – Nov 2025"],
          ["Reach",    "3,900+ merchants"],
          ["Platform", "Web"],
        ].map(([l, v]) => (
          <div className="cs1c-meta-cell" key={l}>
            <div className="cs1c-meta-label">{l}</div>
            <div className="cs1c-meta-val">{v}</div>
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

/* ── 2 · The Merchant's Story ── */
function CMerchantStory() {
  return (
    <div className="cs1-si cs1c-slide">
      <div className="cs1-slide-label">Context &middot; 01</div>
      <h2 className="cs1-slide-h">Akash's morning went sideways.</h2>
      <div className="cs1c-stat-4">
        <BigNum n="23.4%" label="Payment failure rate — 8.2% above baseline" />
        <BigNum n="₹15K–50K" label="Average order value — jewellery, high stakes" />
        <BigNum n="₹1,200" label="CAC per order via Instagram ads, already spent" />
        <BigNum n="₹80K/day" label="Campaign paused while waiting for root cause" />
      </div>
      <SurfaceSlideshow
        tag="The payment ecosystem — Buyer → Razorpay → Banks / Networks → Seller"
        slides={["/cs1/s08.png"]}
      />
      <blockquote className="cs1c-bq">
        <p>&ldquo;Is this us or Razorpay?&rdquo;</p>
        <cite>Akash, PM at Bluestone.com — opening three tabs simultaneously</cite>
      </blockquote>
      <div className="cs1c-callout">
        <strong>17,000+ tickets per year.</strong> Merchants couldn&rsquo;t distinguish their code, the bank, or Razorpay — and no product told them.
      </div>
    </div>
  );
}

/* ── 3 · What is a Downtime? ── */
function CWhatIsDowntime() {
  return (
    <div className="cs1-si cs1c-slide">
      <div className="cs1-slide-label">Context &middot; 02</div>
      <h2 className="cs1-slide-h">What&rsquo;s a payment downtime?</h2>
      <div className="cs1c-definition">
        When a bank, card network, or UPI provider goes down — <strong>all payments on that rail fail.</strong> Razorpay can reroute, but can&rsquo;t fix the underlying infrastructure.
      </div>
      <div className="cs1c-type-row">
        {[
          { n: "01", t: "Bank downtime",          ex: "HDFC, ICICI, Axis — ~60 min avg. resolution" },
          { n: "02", t: "Card network downtime",   ex: "Amex, Visa, Mastercard — affects all cards on that network" },
          { n: "03", t: "UPI downtime",            ex: "NPCI / VPA resolution failures" },
        ].map(({ n, t, ex }) => (
          <div className="cs1c-type-card" key={n}>
            <div className="cs1c-type-n">{n}</div>
            <div className="cs1c-type-t">{t}</div>
            <div className="cs1c-type-ex">{ex}</div>
          </div>
        ))}
      </div>
      <div className="cs1c-callout" style={{ marginTop: 24 }}>
        <strong>The catch:</strong> Merchants never saw any of this happening.
      </div>
    </div>
  );
}

/* ── 5 · Business Problems ── */
function CBizProblems() {
  return (
    <div className="cs1-si cs1c-slide">
      <div className="cs1-slide-label">Problem &middot; 01</div>
      <h2 className="cs1-slide-h">5 business problems.</h2>
      <div className="cs1c-problem-list">
        {[
          { n: "01", t: "Invisible Value",    d: "Merchants don't see Razorpay's backup routing working for them." },
          { n: "02", t: "SR Perception Gap",  d: "SR drops during downtimes → merchants blame Razorpay, not the bank." },
          { n: "03", t: "Manual GTM",         d: "KAMs share insights via PDFs and Slack. Zero self-serve." },
          { n: "04", t: "High Support Load",  d: "17K+ tickets/year. War rooms. Engineering cost every incident." },
          { n: "05", t: "Churn Risk",         d: "Competitors bundle observability. Razorpay feels less intelligent." },
        ].map(({ n, t, d }) => (
          <div className="cs1c-problem-row" key={n}>
            <div className="cs1c-prob-n">{n}</div>
            <div className="cs1c-prob-body">
              <div className="cs1c-prob-t">{t}</div>
              <div className="cs1c-prob-d">{d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 6 · User Problems ── */
function CUserProblems() {
  return (
    <div className="cs1-si cs1c-slide">
      <div className="cs1-slide-label">Problem &middot; 02</div>
      <h2 className="cs1-slide-h">2 user problems.</h2>
      <div className="cs1c-up-grid">
        <div className="cs1c-up-card">
          <div className="cs1c-up-n">01</div>
          <div className="cs1c-up-t">Invisible downtime cost</div>
          <div className="cs1c-up-d">Revenue loss. Bad UX. Support overhead. No way to take action without knowing the cause.</div>
        </div>
        <div className="cs1c-up-card">
          <div className="cs1c-up-n">02</div>
          <div className="cs1c-up-t">Broken communication</div>
          <div className="cs1c-up-d">Generic status page. No merchant-specific view. No real-time clarity. No action path.</div>
        </div>
      </div>
      <div className="cs1c-stat-4" style={{ marginTop: 28 }}>
        <BigNum n="6+ hrs" label="Wait for Razorpay RCA after escalation" />
        <BigNum n="₹80K/day" label="Campaign paused while debugging" />
        <BigNum n="War room" label="Engineering pulled in every time" />
        <BigNum n="Zero" label="Self-serve resolution path for merchants" />
      </div>
    </div>
  );
}

/* ── 8 · Current Experience ── */
function CCurrentExp() {
  return (
    <div className="cs1-si cs1c-slide">
      <div className="cs1-slide-label">Research &middot; 01</div>
      <h2 className="cs1-slide-h">3 steps. No answers.</h2>
      <div className="cs1c-flow">
        <div className="cs1c-flow-step cs1c-flow-ok">
          <div className="cs1c-flow-num">1</div>
          <div className="cs1c-flow-body">
            <div className="cs1c-flow-t">Transactions page</div>
            <div className="cs1c-flow-d">Sees GMV drop. Confirms something is wrong.</div>
          </div>
        </div>
        <div className="cs1c-flow-arrow">↓</div>
        <div className="cs1c-flow-step cs1c-flow-ok">
          <div className="cs1c-flow-num">2</div>
          <div className="cs1c-flow-body">
            <div className="cs1c-flow-t">Failure detail page</div>
            <div className="cs1c-flow-d">4 generic buckets. Too broad to act on.</div>
          </div>
        </div>
        <div className="cs1c-flow-arrow">↓</div>
        <div className="cs1c-flow-step cs1c-flow-dead">
          <div className="cs1c-flow-num">✕</div>
          <div className="cs1c-flow-body">
            <div className="cs1c-flow-t">Dead end</div>
            <div className="cs1c-flow-d">No attribution. No ETA. No action. Calls support → waits 6+ hours.</div>
          </div>
        </div>
      </div>
      <SurfaceSlideshow
        tag="Current Experience — Razorpay Dashboard (before redesign)"
        slides={["/cs1/s15.png", "/cs1/s16.png"]}
      />
      <div className="cs1c-callout" style={{ marginTop: 28 }}>
        Dashboard shows <strong>what</strong> failed — never <strong>why</strong>.
      </div>
    </div>
  );
}

/* ── 9 · Data & Attribution Gap ── */
function CDataAttribution() {
  return (
    <div className="cs1-si cs1c-slide">
      <div className="cs1-slide-label">Research &middot; 02</div>
      <h2 className="cs1-slide-h">~1,900 tickets a month.<br />All the same question.</h2>
      <div className="cs1c-stat-4">
        <BigNum n="17,000+" label="Annual support tickets about payment failures" />
        <BigNum n="~1,900" label="Tickets per month on SR, latency, OTP issues" />
        <BigNum n="5–10%" label="Incidents proactively communicated by Razorpay" />
        <BigNum n="0" label="Tickets with automatic downtime attribution" />
      </div>
      <SurfaceSlideshow
        tag="Attribution gap — failure RCA data + Slack escalation evidence"
        slides={["/cs1/s18.png", "/cs1/s19.png"]}
      />
      <div className="cs1c-ns">
        <span className="cs1c-ns-label">Key insight</span>
        Merchants say &ldquo;my payments are failing&rdquo; — not &ldquo;there&rsquo;s a downtime.&rdquo; The reframe changed everything.
      </div>
    </div>
  );
}

/* ── 10 · HMW ── */
function CHMW() {
  return (
    <div className="cs1-si cs1c-slide">
      <div className="cs1-slide-label">Research &middot; 03</div>
      <h2 className="cs1-slide-h">4 &ldquo;How Might We&rdquo;</h2>
      <div className="cs1c-hmw-list">
        {[
          "How might we make downtimes visible to build trust & reliability?",
          "How might we reduce manual effort in downtime alerting & GTM?",
          "How might we help merchants act during ongoing downtimes?",
          "How might we show the value of Razorpay's backup routing?",
        ].map((q, i) => (
          <div className="cs1c-hmw-row" key={i}>
            <div className="cs1c-hmw-n">HMW {i + 1}</div>
            <div className="cs1c-hmw-q">{q}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 11 · Vision & Outcomes ── */
function CVision() {
  return (
    <div className="cs1-si cs1c-slide">
      <div className="cs1-slide-label">Research &middot; 04</div>
      <h2 className="cs1-slide-h">Make downtimes visible<br />and actionable.</h2>
      <div className="cs1c-ns" style={{ marginBottom: 32 }}>
        <span className="cs1c-ns-label">Vision</span>
        Stop merchants misreading SR drops. Build trust. Enable action. Showcase Razorpay&rsquo;s intelligence.
      </div>
      <div className="cs1c-outcome-list">
        {[
          "Real-time visibility into downtimes by payment method",
          "Quick, informed action on revenue and customer experience",
          "Proactive communication before merchant escalation",
          "Showcase backup routing and recovery value",
          "Eliminate manual alerting and engineering war rooms",
        ].map((o, i) => (
          <div className="cs1c-outcome-row" key={i}>
            <div className="cs1c-outcome-n">0{i + 1}</div>
            <div className="cs1c-outcome-t">{o}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 13 · Iterations ── */
function CIterations() {
  return (
    <div className="cs1-si cs1c-slide">
      <div className="cs1-slide-label">Design &middot; 01</div>
      <h2 className="cs1-slide-h">4 versions. 2 killed.<br />1 concept no competitor had.</h2>
      <div className="cs1c-iter-grid">
        {[
          { v: "v1", t: "Alert-first flow",           verdict: "✕ Killed", note: "Wrong mental model — merchants go to Transactions, not alerts." },
          { v: "v2", t: "Standalone dashboard",        verdict: "✕ Killed", note: "Requires habits merchants hadn't formed." },
          { v: "v3", t: "Contextual injection",        verdict: "✓ Chosen", note: "Meet merchants in Transactions — where they already are." },
          { v: "v4", t: "Blueprint Visualizer",        verdict: "✓ Shipped", note: "Live terminal health map. No competitor has this." },
        ].map(({ v, t, verdict, note }) => (
          <div className={`cs1c-iter-card ${verdict.startsWith("✕") ? "killed" : "chosen"}`} key={v}>
            <div className="cs1c-iter-v">{v}</div>
            <div className="cs1c-iter-t">{t}</div>
            <div className="cs1c-iter-verdict">{verdict}</div>
            <div className="cs1c-iter-note">{note}</div>
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

/* ── 14 · Usability Testing ── */
function CTesting() {
  return (
    <div className="cs1-si cs1c-slide">
      <div className="cs1-slide-label">Design &middot; 02</div>
      <h2 className="cs1-slide-h">5 merchants. 3 tiers.<br />4 consistent signals.</h2>
      <div className="cs1c-tier-row">
        {[
          { t: "Primary", d: "Funded Startups / EB · 4–5 sessions", note: "Highest unmet need. Self-diagnose entirely." },
          { t: "Secondary", d: "Managed MM · 2–3 sessions",          note: "Does self-serve reduce escalations even with TAM support?" },
          { t: "Tertiary", d: "Enterprise · 1–2 sessions",           note: "API / webhook integration preferences." },
        ].map(({ t, d, note }) => (
          <div className="cs1c-tier-card" key={t}>
            <div className="cs1c-tier-label">{t}</div>
            <div className="cs1c-tier-d">{d}</div>
            <div className="cs1c-tier-note">{note}</div>
          </div>
        ))}
      </div>
      <div className="cs1c-signals">
        {[
          ["Impact first",         "GMV + failed count before any decision"],
          ["Business recovery",    "Retry emails/SMS to affected customers"],
          ["API & webhooks",       "Rated higher than email alerts; Discord requested"],
          ["Planned downtime cal", "Highest-rated net-new feature"],
        ].map(([k, v]) => (
          <div className="cs1c-signal-row" key={k}>
            <div className="cs1c-signal-k">{k}</div>
            <div className="cs1c-signal-v">{v}</div>
          </div>
        ))}
      </div>
      <SurfaceSlideshow
        tag="Before vs After — Transaction failure view redesign"
        slides={["/cs1/s27.png"]}
      />
    </div>
  );
}

/* ── 16 · Transactions Dashboard ── */
function CSolutionTx() {
  return (
    <div className="cs1-si cs1c-slide">
      <div className="cs1-slide-label">Solution &middot; Surface 1</div>
      <h2 className="cs1-slide-h">Transactions Dashboard.<br />Root cause — right where you already look.</h2>
      <div className="cs1c-what-changed">
        {[
          ["Anomaly banner",         "Surfaces when a failure cluster is detected — before the merchant even notices."],
          ["Root-cause grouping",    "Failed transactions grouped: \"Axis UPI downtime\", \"HDFC server timeout\"."],
          ["Inline attribution tags","Each row shows its failure reason. \"Is this us or Razorpay?\" — answered instantly."],
        ].map(([k, v]) => (
          <div className="cs1c-change-row" key={k}>
            <div className="cs1c-change-k">{k}</div>
            <div className="cs1c-change-v">{v}</div>
          </div>
        ))}
      </div>
      <SurfaceSlideshow
        tag="Transactions Dashboard — anomaly detection + attribution"
        slides={["/cs1/s32.png", "/cs1/s33.png", "/cs1/s34.png", "/cs1/s35.png", "/cs1/s36.png", "/cs1/s37.png"]}
      />
    </div>
  );
}

/* ── 17 · Downtime Detail Page ── */
function CSolutionDetail() {
  return (
    <div className="cs1-si cs1c-slide">
      <div className="cs1-slide-label">Solution &middot; Surface 2</div>
      <h2 className="cs1-slide-h">Downtime Detail Page.<br />Anxiety → understanding in 2 min.</h2>
      <div className="cs1c-surface-tags">
        {["Title + severity","SR graph","Impact numbers","Recovery actions","Educational explainer","ETA"].map(t => <Tag key={t}>{t}</Tag>)}
      </div>
      <SurfaceSlideshow
        tag="Downtime Detail Page — impact + recommendations + education"
        slides={["/cs1/s38.png", "/cs1/s39.png"]}
      />
      <div className="cs1c-callout" style={{ marginTop: 20 }}>
        <strong>571 transactions. 45% of total. ~60 min resolution.</strong> All visible before the merchant calls support.
      </div>
    </div>
  );
}

/* ── 18 · Downtime Homepage ── */
function CDowntimeHomepage() {
  return (
    <div className="cs1-si cs1c-slide">
      <div className="cs1-slide-label">Solution &middot; Surface 3</div>
      <h2 className="cs1-slide-h">Ecosystem Health Dashboard.<br />The full picture in one place.</h2>
      <div className="cs1c-what-changed">
        {[
          ["Live health status",    "Traffic-light view of every bank, card network & UPI provider."],
          ["Ongoing vs planned",    "Active incidents + scheduled maintenance — separate, scannable."],
          ["Merchant-specific",     "Only shows downtimes affecting your enabled payment methods."],
          ["Historical log",        "Full incident history with resolution times for trend analysis."],
        ].map(([k, v]) => (
          <div className="cs1c-change-row" key={k}>
            <div className="cs1c-change-k">{k}</div>
            <div className="cs1c-change-v">{v}</div>
          </div>
        ))}
      </div>
      <SurfaceSlideshow
        tag="Downtime Homepage — ecosystem health overview + incident list"
        slides={["/cs1/s40.png", "/cs1/s41.png", "/cs1/s42.png"]}
      />
    </div>
  );
}

/* ── 19 · Email → Dashboard Journey ── */
function CJourney() {
  return (
    <div className="cs1-si cs1c-slide">
      <div className="cs1-slide-label">Solution &middot; Surface 4</div>
      <h2 className="cs1-slide-h">Alert to decision.<br />Under 2 minutes.</h2>
      <div className="cs1c-journey">
        {[
          { t: "3:17 PM", step: "Email arrives", d: "High Impact: Amex card network downtime. Severity label. Single CTA." },
          { t: "3:18 PM", step: "Email summary", d: "610 payments affected since 3:15 PM. One click to detail page." },
          { t: "3:19 PM", step: "Detail page",   d: "SR: 80% → 15%. 2,750 failed. 5,000 attempts. Cause confirmed." },
          { t: "3:19 PM", step: "Decision made", d: "Retry email queued. Campaign resumed. War room: avoided." },
        ].map(({ t, step, d }) => (
          <div className="cs1c-journey-step" key={step}>
            <div className="cs1c-journey-time">{t}</div>
            <div className="cs1c-journey-body">
              <div className="cs1c-journey-step-title">{step}</div>
              <div className="cs1c-journey-d">{d}</div>
            </div>
          </div>
        ))}
      </div>
      <SurfaceSlideshow
        tag="Email → Dashboard Journey — 3-step flow from alert to decision"
        slides={["/cs1/s44.png", "/cs1/s45.png", "/cs1/s46.png"]}
      />
    </div>
  );
}

/* ── 20 · Results & Learnings ── */
function COutcome() {
  return (
    <div className="cs1-si cs1c-slide">
      <div className="cs1-slide-label">Results</div>
      <h2 className="cs1-slide-h">Shipped Oct 2025.<br />The numbers held.</h2>
      <div className="cs1c-result-trio">
        <div className="cs1c-result-stat">
          <div className="cs1c-result-n">30–40%</div>
          <div className="cs1c-result-l">Fewer payment-failure support tickets</div>
        </div>
        <div className="cs1c-result-stat cs1c-result-stat--hi">
          <div className="cs1c-result-n">&lt; 5 min</div>
          <div className="cs1c-result-l">Time-to-diagnosis, down from 6+ hours</div>
        </div>
        <div className="cs1c-result-stat">
          <div className="cs1c-result-n">3,900+</div>
          <div className="cs1c-result-l">Merchants at launch across 3 surfaces</div>
        </div>
      </div>
      <blockquote className="cs1c-bq" style={{ marginBottom: 24 }}>
        <p>&ldquo;I can confirm the cause, see impact, and share with my team. This saves hours.&rdquo;</p>
        <cite>Ananya Sharma, PM at Bluestone.com</cite>
      </blockquote>
      <div className="cs1c-refl-pair">
        <div className="cs1c-refl">
          <div className="cs1c-refl-label">Do differently</div>
          <p>Ship the InsightX SR-graph in Phase 1. Every merchant pointed to it first.</p>
        </div>
        <div className="cs1c-refl">
          <div className="cs1c-refl-label">Biggest learning</div>
          <p>Merchants say &ldquo;payments failing&rdquo; not &ldquo;downtime.&rdquo; Getting that reframe right was 70% of the work.</p>
        </div>
      </div>
    </div>
  );
}
