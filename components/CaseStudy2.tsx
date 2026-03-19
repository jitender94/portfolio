"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SurfaceSlideshow from "./SurfaceSlideshow";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SEC_IDS = ["tf-s01", "tf-s02", "tf-s03", "tf-s04", "tf-s05", "tf-s06"];
const NAV_LABELS = ["Brief", "Research", "Problem", "Ideation", "Solution", "Outcome"];

export default function CaseStudy2({ isOpen, onClose }: Props) {
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
          id="cs2"
          ref={overlayRef}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }}
        >
          {/* Header */}
          <div className="ol-header">
            <button className="ol-back" onClick={onClose}>
              &larr; Back to portfolio
            </button>
            <span className="ol-num">Case Study 02</span>
          </div>

          {/* Cover */}
          <div className="cs-v2-cover">
            <div className="cs-v2-cover-img">
              <span>Task Force App — Cover</span>
            </div>
            <div className="cs-v2-cover-head">
              <div className="cs-tag">Razorpay &middot; 2025 &middot; Product Design</div>
              <h1 className="cs-v2-title">Task Force App</h1>
              <p className="cs-v2-hook">
                276 field agents were planning 10&ndash;15 merchant visits a day off WhatsApp messages
                and paper notes, using a bot that worked half the time and a vendor stack costing
                ₹7 lakh a month. We rebuilt the entire field operations experience from scratch &mdash;
                and 40% of agents adopted it in a single day.
              </p>
            </div>
            <div className="cs-v2-overview">
              {[
                ["Role", "Lead Product Designer"],
                ["Timeline", "Aug 2024 – May 2025"],
                ["Platform", "Android Mobile App"],
                ["Reach", "276 agents, Pan-India"],
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
            {/* Sticky sidebar */}
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

              {/* ── 01 · Brief ── */}
              <div className="cs-sec-v2" id="tf-s01">
                <div className="cs-sec-v2-label">01 &middot; Brief</div>
                <h2 className="cs-sec-v2-h">
                  Field agents were the backbone of merchant onboarding.
                  Their tools were failing them.
                </h2>

                <p className="cs-sec p">
                  Razorpay POS deploys payment terminals across thousands of merchants in India. Behind every
                  installation, deactivation, and repair is a Field Engineer &mdash; a frontline contractor
                  managing 10&ndash;15 merchant visits per day, navigating broken tools, paper-based
                  processes, and an unreliable WhatsApp bot that worked roughly half the time.
                </p>

                <div className="cs-stat-hero-row">
                  {[
                    ["60+ min", "Per enterprise installation due to fragmented, manual workflows"],
                    ["₹7L/month", "Vendor cost for old Asti + TAMS stack — both underperforming"],
                    ["8,000", "Devices lost with zero validation or trackability — ₹1 Cr P&L hit"],
                    ["~20%", "Of all field ticket service violations absorbed by Customer Support"],
                  ].map(([num, label]) => (
                    <div className="cs-stat-hero" key={num}>
                      <div className="cs-stat-hero-num">{num}</div>
                      <div className="cs-stat-hero-label">{label}</div>
                    </div>
                  ))}
                </div>

                <p className="cs-sec p">
                  Two vendors powered the old stack: SAP B1 via TAMS for backend, and Asti for frontend.
                  Asti had persistent technical issues &mdash; agents stopped trusting it. The fallback was
                  a WhatsApp bot with a ~50% success rate. When it failed, agents called Customer Support,
                  adding 45+ minutes to what should have been a 5-minute task.
                </p>

                <p className="cs-sec p">
                  Each agent visit cost Razorpay <strong>₹280</strong>. Repeat visits &mdash; caused
                  entirely by tool failures &mdash; compounded fast. Merchant CSAT after field resolution
                  hovered at ~80%, with no mechanism to explain device issues or verify installations were
                  done correctly. Devices left merchant premises without any trackability check.
                </p>
              </div>

              {/* ── 02 · Research ── */}
              <div className="cs-sec-v2" id="tf-s02">
                <div className="cs-sec-v2-label">02 &middot; Research</div>
                <h2 className="cs-sec-v2-h">
                  Four research methods. One field visit changed everything.
                </h2>

                <p className="cs-sec p">
                  Before a single wireframe was drawn, I spent time in the field. The research covered
                  four methods: ethnographic field visits, a structured group discussion with 14 FEs, a call
                  centre session, and a service centre visit. Each surfaced a distinct layer of the problem.
                </p>

                <div className="cs-v2-callout">
                  <div className="cs-v2-callout-label">Field visit observation — Bengaluru</div>
                  <div className="cs-v2-callout-text">
                    Every morning, agents received a WhatsApp message from their team lead &mdash; a list of
                    merchant names, ticket numbers, and pincodes. They copied this onto paper. Sorted by
                    pincode. That was their route plan.
                  </div>
                </div>

                <p className="cs-sec p">
                  <strong>Method 1 &mdash; Field Visits (Ethnographic Research)</strong>
                </p>
                <p className="cs-sec p">
                  I shadowed 2 FEs across different zones in Bengaluru through actual merchant visits &mdash;
                  Babai Tiffins (HSR), Pepper Leaf Restaurant (Marathahalli), and Radha Krishna Chinese Fast
                  Food (Bommanahalli). What I observed shaped every major design decision that followed.
                </p>

                <div className="cs-personas" style={{ marginBottom: 28 }}>
                  {[
                    ["Paper Planning", "Daily routes built on WhatsApp list + hand-sorted notepad"],
                    ["Physical Forms", "Merchant name, serial no., signature — all handwritten, per visit"],
                    ["1 Device / Ticket", "5–15 devices = 5–15 separate WhatsApp bot sessions for bulk installs"],
                    ["Bot Failures", "~50% success rate; every failure added 45+ min via call centre"],
                    ["Battery Drain", "Always-on GPS drained personal phones significantly across the day"],
                    ["Compliance as Theatre", "Bank checklists signed; training rarely given, especially for breakfix"],
                  ].map(([name, sub]) => (
                    <div key={name} className="cs-persona">
                      <div className="cs-persona-name">{name}</div>
                      <div className="cs-persona-sub">{sub}</div>
                    </div>
                  ))}
                </div>

                <p className="cs-sec p">
                  <strong>Method 2 &mdash; Group Discussion with 14 Field Engineers</strong>
                </p>
                <p className="cs-sec p">
                  A cross-functional team (Product, Design, Engineering, Analytics) facilitated a structured
                  session at the FE hub in Kalyan Nagar, Bengaluru. New tickets arrived at 11 AM and 4 PM,
                  disrupting planned routes. 80% of tickets were retail (1&ndash;5 TIDs); 20% were
                  enterprise (5+ TIDs). Agents sometimes visited the same location twice when two tickets
                  had different device models at the same merchant. 10&ndash;20% of pre-visit calls found
                  the ticket was raised by mistake &mdash; a wasted trip before it began.
                </p>

                <div className="cs-pullquote">
                  <div className="cs-pullquote-text">
                    &ldquo;50% success rate on the bot is normal for us. When it fails we call support
                    &mdash; 45 minutes, sometimes more.&rdquo;
                  </div>
                  <div className="cs-pullquote-cite">Field Engineer &mdash; group discussion, Kalyan Nagar</div>
                </div>

                <p className="cs-sec p">
                  <strong>Method 3 &mdash; Call Centre Agent Session</strong>
                </p>
                <p className="cs-sec p">
                  A session with call centre agents revealed the downstream burden of field failures. ~50%
                  of inbound calls were about battery life (1&ndash;2 hours vs a competitor benchmark of
                  8&ndash;10 hours). ~30% were network issues. Agents spent 6&ndash;8 minutes per
                  troubleshooting call with no SOPs or guiding tools, hopping across 3&ndash;4 portals per
                  call. Merchant CSAT had dropped from ~80% in July 2024 to 72% by December 2024.
                </p>

                <p className="cs-sec p">
                  <strong>Method 4 &mdash; Service Centre Visit (March 2025)</strong>
                </p>
                <p className="cs-sec p">
                  A direct visit to the Razorpay POS service centre surfaced the support-side tooling
                  problem: PAX Portal, Zoho Assist, Ezetap CRM, and FreshDesk running simultaneously,
                  constant context-switching. During the visit demo, Zoho Assist failed live &mdash; a
                  fitting illustration of the reliability gap. No time filter on transaction search made
                  high-volume enterprise merchants extremely slow to troubleshoot.
                </p>

                <p className="cs-sec p">
                  <strong>Competitive Analysis</strong>
                </p>
                <p className="cs-sec p">
                  A detailed audit across Paytm PSA App, PhonePe ACE, Pine Labs (Map My India Workmate),
                  and Bajaj Finserv (Myfinfi) showed Razorpay was behind on fundamentals all competitors
                  had already solved &mdash; bulk workflows, route planning, and consolidated multi-device
                  support in a single app. Pine Labs and Bajaj Finserv both offered salary tied to
                  productivity; Paytm and PhonePe combined sales and service in the same app. Razorpay was
                  starting from zero on all of these.
                </p>
              </div>

              {/* ── 03 · Problem ── */}
              <div className="cs-sec-v2" id="tf-s03">
                <div className="cs-sec-v2-label">03 &middot; Problem</div>
                <h2 className="cs-sec-v2-h">
                  This wasn&rsquo;t a tooling problem. It was a trust problem &mdash;
                  for agents, merchants, and Razorpay alike.
                </h2>

                <p className="cs-sec p">
                  Research synthesis bucketed the problems into three perspectives. Framing it this way
                  changed the design conversation from &ldquo;make the bot better&rdquo; to &ldquo;rebuild
                  the entire field experience.&rdquo;
                </p>

                <p className="cs-sec p">
                  <strong>From the FE&rsquo;s perspective:</strong> No smart task list &mdash; forced to
                  work off WhatsApp messages and paper notes. One device per ticket &mdash; enormous
                  overhead for enterprise merchants with 5&ndash;15 devices. ~50% WhatsApp bot failure rate
                  and Asti validation errors (NULL errors, &ldquo;device mapped to other terminal&rdquo;).
                  Manually typing MID, TID, device model, and username every single visit. No device
                  trackability &mdash; devices mapped without validation, enabling misplacement.
                </p>

                <p className="cs-sec p">
                  <strong>From the Merchant&rsquo;s perspective:</strong> 60+ minute installation times for
                  enterprise setups. FEs rarely explained device usage or root causes during breakfix visits
                  &mdash; the wrong charger, SIM vs WiFi confusion never addressed. No post-install
                  verification, no training quality, no brand touchpoint. Purely transactional handover.
                </p>

                <p className="cs-sec p">
                  <strong>From Razorpay&rsquo;s perspective:</strong> No real-time FE visibility, no route
                  planning, no location tracking. ₹7 lakh/month in vendor costs for tools agents weren&rsquo;t
                  using. 8,000 devices lost with a ₹1 Cr P&L hit. Zero compliance enforcement &mdash; no
                  photo proof mandate, no device validation, no digital signature.
                </p>

                <div className="cs-v2-callout">
                  <div className="cs-v2-callout-label">North Star</div>
                  <div className="cs-v2-callout-text">
                    &ldquo;A field agent should complete a device installation in under 5 minutes &mdash;
                    with full compliance, zero manual data entry, and a merchant who knows exactly what
                    they&rsquo;ve signed up for.&rdquo;
                  </div>
                </div>

                <p className="cs-sec p">
                  Five design goals followed: replace the WhatsApp bot with a reliable, pre-populated task
                  experience; enable multi-device servicing in a single ticket; digitise the entire field
                  journey from attendance to closure; build in smart compliance (photo mandates, device
                  validation, merchant OTP, digital signature); and make the app genuinely enjoyable to use
                  &mdash; because adoption follows delight.
                </p>
              </div>

              {/* ── 04 · Ideation ── */}
              <div className="cs-sec-v2" id="tf-s04">
                <div className="cs-sec-v2-label">04 &middot; Ideation</div>
                <h2 className="cs-sec-v2-h">
                  Three strategic directions. Eight homepage iterations.
                  Two rounds of field testing.
                </h2>

                <p className="cs-sec p">
                  Before screens, the strategic question was what kind of product to build &mdash; a patch
                  on Asti, an extension of the WhatsApp bot, or a ground-up replacement. Three directions
                  were evaluated.
                </p>

                <div className="cs-v2-directions">
                  <div className="cs-v2-dir killed">
                    <div className="cs-v2-dir-letter">Direction A</div>
                    <div className="cs-v2-dir-title">Patch Asti + improve the WhatsApp bot</div>
                    <div className="cs-v2-dir-desc">
                      Fix the existing tools. Reduce validation errors. Improve bot reliability. Killed
                      early &mdash; agents had already lost trust in both tools. You can&rsquo;t design
                      trust back into a product people associate with failure.
                    </div>
                    <div className="cs-v2-dir-verdict">✕ Wrong foundation</div>
                  </div>
                  <div className="cs-v2-dir killed">
                    <div className="cs-v2-dir-letter">Direction B</div>
                    <div className="cs-v2-dir-title">Better frontend wrapper on existing backend</div>
                    <div className="cs-v2-dir-desc">
                      A polished frontend over the same SAP B1 backend. Eliminated when engineering
                      confirmed the backend was being migrated to SAP HANA &mdash; building a wrapper
                      would mean rebuilding the frontend twice within 1&ndash;2 quarters.
                    </div>
                    <div className="cs-v2-dir-verdict">✕ Tech debt would follow</div>
                  </div>
                  <div className="cs-v2-dir chosen" style={{ gridColumn: "1 / -1" }}>
                    <div className="cs-v2-dir-letter">Direction C &mdash; Chosen</div>
                    <div className="cs-v2-dir-title">Ground-up Task Force App with smart task management</div>
                    <div className="cs-v2-dir-desc">
                      Full replacement of Asti and the WhatsApp bot. Pre-populated task list, multi-device
                      single-ticket mapping, barcode scan-first workflows, compliance enforcement, and
                      inventory visibility &mdash; all in one reliable tool. Aligned with the SAP HANA
                      migration roadmap. Eliminates vendor costs. Earns agent trust through reliability.
                    </div>
                    <div className="cs-v2-dir-verdict">✓ Clean slate. New trust. Vendor eliminated.</div>
                  </div>
                </div>

                <p className="cs-sec p">
                  <strong>Key design decisions</strong>
                </p>

                <p className="cs-sec p">
                  <em>Attendance + Day Overview &mdash; &ldquo;Swipe to Start&rdquo;:</em> Originally just
                  an attendance check-in. Research showed agents had no overview of their day before
                  heading out. The screen was evolved into a dual-purpose surface showing today&rsquo;s
                  task count and type breakdown before work begins. The swipe gesture (vs a tap) was
                  intentional &mdash; a deliberate action that marks the psychological start of the day.
                </p>

                <p className="cs-sec p">
                  <em>Homepage &mdash; 8&ndash;10 iterations:</em> The homepage needed to balance task list
                  with priority, distance, and TAT indicators; device/SIM inventory at a glance; and enough
                  per-ticket context to avoid opening a ticket just to get the merchant&rsquo;s address.
                  Getting the right information density for a screen used while standing in a
                  merchant&rsquo;s shop took the most iteration of any single surface in the product.
                </p>

                <p className="cs-sec p">
                  <em>Device Mapping &mdash; the core flow:</em> The most technically and experientially
                  complex problem. Progressive disclosure (reveal only the next required step), scan-first
                  (barcode as primary input, manual as fallback), and a small success animation after each
                  device maps &mdash; together these made a multi-step, high-pressure flow feel manageable
                  and even rewarding.
                </p>

                <p className="cs-sec p">
                  <em>SIM scan as secondary:</em> Initial assumption was scan-first for SIM too. Research
                  revealed 80&ndash;90% of SIM barcodes are absent or unreadable in the field. Manual entry
                  was made the primary path; scanning became the faster fallback. The discovery came
                  directly from user testing &mdash; not assumptions.
                </p>

                <p className="cs-sec p">
                  <strong>User Testing</strong>
                </p>
                <p className="cs-sec p">
                  Round 1 &mdash; guerrilla testing with 3 FEs using a clickable prototype &mdash; surfaced
                  questions about validation errors carrying over, friction with multi-photo capture, and
                  edge cases in the SIM unlinking flow during breakfix visits. Round 2 (December 13, 2024)
                  &mdash; end-to-end testing with 14 FEs at the Razorpay office &mdash; produced a
                  structured table of feedback, all of it actioned: SIM scan made secondary (manual primary
                  for 80&ndash;90% of cases), progress bar reduced in prominence for repeat journeys,
                  &ldquo;RRN&rdquo; replaced with &ldquo;Transaction Number&rdquo;, priority badge added
                  after agents couldn&rsquo;t distinguish urgency at a glance, photo upload component
                  redesigned with stronger tap affordance.
                </p>
              </div>

              {/* ── 05 · Solution ── */}
              <div className="cs-sec-v2" id="tf-s05">
                <div className="cs-sec-v2-label">05 &middot; Solution</div>
                <h2 className="cs-sec-v2-h">
                  From paper notes to a single reliable tool &mdash; 60 minutes to under 5.
                </h2>

                <p className="cs-sec p">
                  The Task Force App replaced the entire fragmented stack with one tool. The design was
                  built around four key surfaces, each serving a distinct moment in the FE&rsquo;s day
                  &mdash; from attendance to ticket closure.
                </p>

                {/* Surface 1 */}
                <div className="cs-v2-surface">
                  <div className="cs-v2-surface-meta">
                    <span className="cs-v2-surface-num">Surface 1</span>
                    <span className="cs-v2-surface-role">Start of day</span>
                  </div>
                  <h3 className="cs-v2-surface-title">Attendance + Day Overview</h3>
                  <p className="cs-sec p">
                    FEs open the app and immediately see their day: total open tickets, new tickets added
                    since last session, and ticket type breakdown. They mark attendance via a deliberate
                    swipe gesture before heading out. No more WhatsApp lists. No more paper notes. The
                    start of work feels intentional.
                  </p>
                  <SurfaceSlideshow
                    tag="Attendance screen — swipe to start + day overview"
                    slides={[
                      "Attendance screen — today's task count, new tickets, type breakdown",
                      "Swipe-to-start gesture — deliberate action before the workday begins",
                      "Post-swipe state — day summary confirmed, proceed to task list",
                    ]}
                  />
                </div>

                {/* Surface 2 */}
                <div className="cs-v2-surface">
                  <div className="cs-v2-surface-meta">
                    <span className="cs-v2-surface-num">Surface 2</span>
                    <span className="cs-v2-surface-role">Task management</span>
                  </div>
                  <h3 className="cs-v2-surface-title">Prioritised Ticket Homepage</h3>
                  <p className="cs-sec p">
                    Every ticket card shows ticket type (Installation / Deactivation / Servicing) with
                    colour coding, merchant name, distance, estimated travel time, TAT status (Overdue,
                    1 day left, 2 days left), and a priority flag for urgent installs. Agents sort by
                    distance or priority &mdash; and plan their day directly in the app. Device and SIM
                    inventory is visible at a glance, eliminating mismatches between what agents carry and
                    what they&rsquo;re expected to install.
                  </p>
                  <SurfaceSlideshow
                    tag="Ticket homepage — prioritised task list with TAT, distance & inventory"
                    slides={[
                      "Homepage — ticket cards with type, merchant name, distance, TAT status",
                      "Priority view — urgent tickets flagged, overdue tickets highlighted",
                      "Inventory panel — available device and SIM stock at a glance",
                      "Sort & filter — by distance, priority, or ticket type",
                    ]}
                  />
                </div>

                {/* Surface 3 */}
                <div className="cs-v2-surface">
                  <div className="cs-v2-surface-meta">
                    <span className="cs-v2-surface-num">Surface 3</span>
                    <span className="cs-v2-surface-role">The core flow</span>
                  </div>
                  <h3 className="cs-v2-surface-title">Multi-Device Mapping &mdash; Scan-First</h3>
                  <p className="cs-sec p">
                    The biggest workflow unlock. One ticket can now contain multiple TIDs. The FE scans all
                    devices sequentially within the same ticket, getting one merchant OTP at the end &mdash;
                    not one per device. For Enterprise merchants with 10+ devices, this reduced installation
                    time from 60+ minutes to under 10 minutes in pilot.
                  </p>
                  <p className="cs-sec p">
                    All ticket and merchant details are pre-populated &mdash; the agent only confirms, scans,
                    and proceeds. Barcode scanning is the primary input (faster); manual entry is the
                    fallback. A small animation plays after each device maps: <em>&ldquo;TID 1 of 2 mapped
                    successfully!&rdquo;</em> &mdash; a moment of delight in a high-pressure, repetitive flow.
                  </p>
                  <SurfaceSlideshow
                    tag="Device mapping — scan-first, multi-device, progressive disclosure"
                    slides={[
                      "Ticket detail — pre-populated merchant and device info, one tap to begin",
                      "Device scan — barcode scanner view with manual entry fallback",
                      "TID mapped — celebratory animation state after each device confirmed",
                      "Multi-device progress — sequential TID mapping within a single ticket",
                      "SIM scan — secondary flow; manual entry is primary for 80–90% of cases",
                    ]}
                  />
                </div>

                {/* Surface 4 */}
                <div className="cs-v2-surface">
                  <div className="cs-v2-surface-meta">
                    <span className="cs-v2-surface-num">Surface 4</span>
                    <span className="cs-v2-surface-role">Compliance + closure</span>
                  </div>
                  <h3 className="cs-v2-surface-title">Compliance-First Ticket Closure</h3>
                  <p className="cs-sec p">
                    The closure flow enforces test transaction screenshots (mandatory), device photos
                    (contextual &mdash; mandatory for installation, optional for breakfix), merchant OTP
                    verification, and a digital merchant signature replacing the physical DSC form.
                    &ldquo;Resolved on call&rdquo; is available as a closure option for minor issues,
                    eliminating photo friction that research flagged as unnecessary for call-resolved tickets.
                  </p>
                  <SurfaceSlideshow
                    tag="Ticket closure — compliance, digital signature, photo documentation"
                    slides={[
                      "Test transaction screenshot — mandatory capture integrated into the flow",
                      "Photo documentation — mandatory and contextual categories clearly marked",
                      "Merchant OTP verification — single OTP for all devices in the ticket",
                      "Digital signature — merchant signs on-screen; replaces physical DSC form",
                      "Ticket closed — completion state with summary",
                    ]}
                  />
                </div>

                {/* UX moments */}
                <div style={{ marginTop: 56, paddingTop: 40, borderTop: "1px solid var(--cs-border)" }}>
                  <p className="cs-sec p" style={{ marginBottom: 24 }}>
                    <strong>UX Goodness &mdash; moments designed to go beyond functional:</strong>
                  </p>
                  <div className="cs-h-timeline">
                    {[
                      ["Swipe to Start", "Attendance uses a swipe vs tap — the start of the workday feels deliberate. Sets the tone for everything that follows."],
                      ["Mapping Animation", "Small celebratory state after each device maps. Tiny delight in a repetitive, high-pressure task."],
                      ["Progressive Disclosure", "Multi-step mapping reveals one action at a time. Prevents overload at the most complex moment in the FE's job."],
                      ["Merchant Delight (WIP)", "Post-install WhatsApp to merchant with digital service form, onboarding videos, and welcome message — turning a transactional handover into a brand moment."],
                    ].map(([label, text]) => (
                      <div className="cs-h-tl-item" key={label}>
                        <div className="cs-h-tl-label">{label}</div>
                        <div className="cs-h-tl-text">{text}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* QR Extension */}
                <div style={{ marginTop: 56, paddingTop: 40, borderTop: "1px solid var(--cs-border)" }}>
                  <div className="cs-v2-surface-meta">
                    <span className="cs-v2-surface-num">Extension</span>
                    <span className="cs-v2-surface-role">Platformization</span>
                  </div>
                  <h3 className="cs-v2-surface-title">QR Activation &mdash; 60 Days to 1 Day</h3>
                  <p className="cs-sec p">
                    The Task Force App was extended beyond POS devices to handle QR activations across all
                    device types (WD10, AP101A, Soundbox, Stickers) for both OMNI and non-OMNI stacks via
                    configurable feature flags. Previously, setting up activation flows for a new bank
                    required 60&ndash;100 engineering days. With modular feature flags that auto-adapt to
                    device type and bank specifications &mdash; this dropped to under 1 day.
                  </p>
                  <p className="cs-sec p">
                    67K live QR devices (₹956 Cr GMV) were at risk during the OMNI migration since
                    existing workflows would be disrupted. The unified interface covered all of them without
                    a separate tool or additional agent training. First-time activation success rate:
                    80%+ for the Indian Bank pilot (21 devices, OMNI stack).
                  </p>
                </div>
              </div>

              {/* ── 06 · Outcome ── */}
              <div className="cs-sec-v2" id="tf-s06">
                <div className="cs-sec-v2-label">06 &middot; Outcome</div>
                <h2 className="cs-sec-v2-h">
                  Pan-India in May 2025. Five signals define success.
                </h2>

                <p className="cs-sec p">
                  Launched to all 276 agents Pan-India on May 20, 2025. Impact assessed across pre-period
                  (May 12&ndash;25) and post-period (May 26&ndash;June 6).
                </p>

                <div className="cs-stat-hero-row">
                  {[
                    ["+12.5%", "Tickets closed per day — 1,227 → 1,380"],
                    ["−57%", "De-installation time — 4.82 days → 2.07 days"],
                    ["+13.9%", "Agent productivity — 4.6 → 5.3 tickets/agent/day"],
                    ["40%+", "Adoption in 1 day across all 276 agents on Pan-India rollout"],
                  ].map(([num, label]) => (
                    <div className="cs-stat-hero" key={num}>
                      <div className="cs-stat-hero-num">{num}</div>
                      <div className="cs-stat-hero-label">{label}</div>
                    </div>
                  ))}
                </div>

                <p className="cs-sec p">
                  Average time to ticket closure improved from <strong>2.9 days → 1.9 days</strong>,
                  trending toward 1.5&ndash;1.6 days in June. Top-quartile agents (Q4) jumped from
                  8.8 to 11.5 tickets closed per day &mdash; a <strong>30.3% improvement</strong> for
                  the most productive segment of the field team.
                </p>

                <p className="cs-sec p">
                  Service violations (SVs) raised within 7 days of ticket closure dropped from
                  <strong> 7.5% → 5.9%</strong> (&minus;1.6pp). QR activation setup time for new banks
                  went from 60&ndash;100 engineering days to under 1 day. ₹24 lakh/year saved by
                  eliminating the Asti vendor &mdash; with an additional ₹60 lakh/year in savings
                  expected once SAP B1 → SAP HANA migration completes in the next 1&ndash;2 quarters.
                  100% of new-bank QR activations now run through the unified app.
                </p>

                <div className="cs-v2-reflect">
                  <div className="cs-v2-reflect-item">
                    <div className="cs-v2-reflect-label">What worked</div>
                    <p>Going to the field before the first wireframe. The paper notepad, the physical service form, the WhatsApp bot screenshot &mdash; these weren&rsquo;t data points, they were the design brief. Every decision was traceable to something seen or heard on those visits. The decision to treat the agent app as a consumer-grade product &mdash; not a utility tool &mdash; paid off in adoption speed. 40% of agents adopted it in a single day.</p>
                  </div>
                  <div className="cs-v2-reflect-item">
                    <div className="cs-v2-reflect-label">What I&rsquo;d do differently</div>
                    <p>Push harder for map/route planning in the first release. Research showed it clearly &mdash; agents were visiting the same location twice because ticket aggregation by location wasn&rsquo;t available. I deprioritised it to ship faster. The multi-device mapping flow was also the hardest design problem I&rsquo;ve faced; I&rsquo;d prototype the scan interaction in code much earlier, before committing to Figma frames, to surface the state-management complexity sooner.</p>
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
