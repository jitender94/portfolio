"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PhoneSlideshow from "./PhoneSlideshow";
import FlowDiagram from "./FlowDiagram";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SEC_IDS = ["tf-s01", "tf-s02", "tf-s03", "tf-s04", "tf-s05", "tf-s06"];
const NAV_LABELS = ["Brief", "Research", "Problem", "Ideation", "Solution", "Outcome"];

/* ── Slide data ── */

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
  { src: "/cs2/deactivation/Deactivation1.png", annotation: "Servicing starts — old device removal: ticket with merchant info and TIDs to unmap" },
  { src: "/cs2/deactivation/Unmapping1.png", annotation: "Phase 1 — Device unmapping: Total TIDs 02, Unmapped 00, begin unmapping" },
  { src: "/cs2/deactivation/Unmapping5.png", annotation: "Unmap TID — old device serial + SIM confirmed, status logged (working/not working/missing)" },
  { src: "/cs2/deactivation/Unmapping10.png", annotation: "Old devices unmapped ✓ — phase 1 complete, proceed to install replacement" },
  { src: "/cs2/installation/Installation2.png", annotation: "Phase 2 — New device installation: map replacement TIDs in the same ticket" },
  { src: "/cs2/installation/Mapping3.png", annotation: "Scan new device serial — same scan-first mapping flow as standalone installation" },
  { src: "/cs2/installation/Mapping13.png", annotation: "New devices mapped ✓ — upload photos, verify OTP, close ticket" },
  { src: "/cs2/installation/Confirmation1.png", annotation: "Servicing complete ✓ — old device out, new device live, confirmation sent" },
];

const revisitSlides = [
  { src: "/cs2/edge-cases/Revisit1.png", annotation: "'Issues with the task?' — choose Revisit, select a rescheduled date and reason" },
  { src: "/cs2/edge-cases/Revisit3.png", annotation: "Date selected: 23/12/2024 — reason: Merchant not present / shop closed" },
  { src: "/cs2/edge-cases/Revisit5.png", annotation: "Other reason — free text comment captured: 'Merchant not picking up call'" },
  { src: "/cs2/edge-cases/Revisit7.png", annotation: "Task rescheduled for 23rd December ✓ — reason logged, return to homepage" },
];

const problematicSlides = [
  { src: "/cs2/edge-cases/Problematic1.png", annotation: "Problematic — choose from dropdown: technical issue, shop closed, wrong merchant, etc." },
  { src: "/cs2/edge-cases/Problematic3.png", annotation: "Shop closed permanently — contact name + mobile captured for ops audit trail" },
  { src: "/cs2/edge-cases/Problematic5.png", annotation: "Task marked as problematic ✓ — reason logged, ticket escalated to central ops" },
];

const partialTxnSlides = [
  { src: "/cs2/partial-txns/partial-test-txns1.png", annotation: "Test transaction check — mandatory before proceeding, TID 45432 at 0% (not yet done)" },
  { src: "/cs2/partial-txns/partial-test-txns3.png", annotation: "Mixed results — 6/8 done at 50%, failed TIDs highlighted for re-attempt or escalation" },
  { src: "/cs2/partial-txns/partial-test-txns5.png", annotation: "Incomplete task — only 3/5 devices installed, save copy option to preserve progress" },
];

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
            <div className="cs-v2-cover-img" role="img" aria-label="Field agent holding Task Force App in front of a merchant" style={{ backgroundImage: "url('/cs2/hero.jpg')" }}>
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
                ["Role", "Research · Prototyping · Product Design"],
                ["Timeline", "3–4 months"],
                ["Platform", "PWA (Progressive Web App)"],
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
                  Context first. Then four research methods that changed the brief entirely.
                </h2>

                {/* ── CONTEXT ── */}
                <div className="cs-research-subsect">Context</div>

                {/* Who is a Field Executive */}
                <h3 className="cs-v2-surface-title" style={{ marginBottom: 12 }}>Who is a Field Executive (FE)?</h3>
                <p className="cs-sec p">
                  A field engineer is someone who visits offline merchants to resolve tickets in person.
                  FEs are assigned to specific areas within a city &mdash; tickets are routed to them
                  by geography to minimise travel. They get daily targets and report to the city office
                  each morning to collect the devices they&rsquo;ll need for installations.
                </p>
                <div className="cs-personas" style={{ marginBottom: 40 }}>
                  {[
                    ["Area-based assignment", "FEs cover specific zones. Tickets are allocated by pincode to minimise travel."],
                    ["Daily targets", "Each FE receives a ticket list and collects devices from the city office every morning."],
                    ["EOD reporting", "At end of day, FEs return to the city office, report back to their TL, and return collected devices."],
                  ].map(([name, sub]) => (
                    <div key={name} className="cs-persona">
                      <div className="cs-persona-name">{name}</div>
                      <div className="cs-persona-sub">{sub}</div>
                    </div>
                  ))}
                </div>

                {/* What kind of requests */}
                <h3 className="cs-v2-surface-title" style={{ marginBottom: 16 }}>What kind of requests do we get today?</h3>
                <div className="cs-v2-request-types">
                  {([
                    ["01", "Installation", "New devices to be deployed at a merchant store.", "/cs2/research/Installation.png"],
                    ["02", "Deactivation", "Device deactivation and collection from the merchant store.", "/cs2/research/Deactivation.png"],
                    ["03", "Servicing", "Fixing of devices, including full device replacement.", "/cs2/research/Servicing.png"],
                  ] as [string, string, string, string][]).map(([num, title, desc, img]) => (
                    <div key={num} className="cs-v2-request-card">
                      <div className="cs-v2-request-num">{num}</div>
                      <div className="cs-v2-request-title">{title}</div>
                      <div className="cs-v2-request-desc">{desc}</div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt={title + " illustration"} className="cs-v2-request-illus" />
                    </div>
                  ))}
                </div>

                {/* How do we get these requests — flow diagram */}
                <h3 className="cs-v2-surface-title" style={{ marginBottom: 16 }}>How do we get these requests?</h3>
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

                {/* Current journey of a Field Executive */}
                <h3 className="cs-v2-surface-title" style={{ marginBottom: 16 }}>Current journey of a Field Executive</h3>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/cs2/research/Current journey.png" alt="Current journey of a Field Executive" className="cs-v2-journey-img" />

                {/* ── INSIGHTS ── */}
                <div className="cs-research-subsect">Research Insights</div>

                {/* Insight 01 */}
                <div className="cs-v2-insight cs-v2-insight-dual">
                  <div className="cs-v2-insight-body">
                    <div className="cs-v2-insight-num">Insight 01</div>
                    <div className="cs-v2-insight-title">FE day planning: receiving and prioritising tickets is a cumbersome process</div>
                    <p className="cs-v2-insight-text">
                      FEs receive ticket lists as dense, unformatted WhatsApp messages from their team lead.
                      They then manually copy this onto paper and re-sort by pincode to create their own route plan.
                      Any new tickets added mid-day disrupted the entire plan.
                    </p>
                  </div>
                  <div className="cs-v2-insight-imgs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/cs2/research/insight-1a.jpg" alt="WhatsApp messages with dense unformatted ticket list" className="cs-v2-insight-img" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/cs2/research/insight-1b.jpg" alt="Handwritten paper list of merchants and pincodes" className="cs-v2-insight-img" />
                  </div>
                </div>

                {/* Insight 02 */}
                <div className="cs-v2-insight cs-v2-insight-rev">
                  <div className="cs-v2-insight-body">
                    <div className="cs-v2-insight-num">Insight 02</div>
                    <div className="cs-v2-insight-title">The process is not completely digital &mdash; physical service forms are still in use</div>
                    <p className="cs-v2-insight-text">
                      For every merchant visit, FEs filled out a physical Razorpay service form by hand &mdash;
                      merchant name, address, device serial numbers, signatures. These were submitted at EOD
                      and entered manually into the system, creating delays and transcription errors.
                    </p>
                  </div>
                  <div className="cs-v2-insight-imgs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/cs2/research/insight-2.jpg" alt="Physical Razorpay service form filled by hand at merchant site" className="cs-v2-insight-img" />
                  </div>
                </div>

                {/* Insight 03 */}
                <div className="cs-v2-insight">
                  <div className="cs-v2-insight-body">
                    <div className="cs-v2-insight-num">Insight 03</div>
                    <div className="cs-v2-insight-title">Merchant training is not given efficiently</div>
                    <p className="cs-v2-insight-text">
                      Device training was supposed to be mandatory at every installation. In practice, FEs were under
                      time pressure and training was often rushed or skipped &mdash; especially for breakfix visits.
                      Merchants were left operating devices they didn&rsquo;t fully understand.
                    </p>
                  </div>
                  <div className="cs-v2-insight-imgs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/cs2/research/insight-3.jpg" alt="Field executive showing a merchant how to use the device" className="cs-v2-insight-img" />
                  </div>
                </div>

                {/* Insight 04 */}
                <div className="cs-v2-insight cs-v2-insight-rev">
                  <div className="cs-v2-insight-body">
                    <div className="cs-v2-insight-num">Insight 04</div>
                    <div className="cs-v2-insight-title">80% of tickets are retail &mdash; but the 20% enterprise takes disproportionate time</div>
                    <p className="cs-v2-insight-text">
                      80% of tickets are retail merchants (1&ndash;5 TIDs). 20% are enterprise and mid-market (5+ TIDs).
                      The enterprise segment drove the most friction: one ticket could require 5&ndash;15 separate
                      WhatsApp bot sessions and physical form copies.
                    </p>
                  </div>
                  <div className="cs-v2-pie">
                    <div>
                      <div className="cs-v2-pie-pct">80%</div>
                      <div className="cs-v2-pie-bar-wrap" style={{ marginTop: 6, marginBottom: 4 }}>
                        <div className="cs-v2-pie-bar-fill" style={{ width: "80%", height: "100%", background: "#1657d4" }} />
                      </div>
                      <div className="cs-v2-pie-label">Retail &mdash; 1 to 5 TIDs</div>
                    </div>
                    <div>
                      <div className="cs-v2-pie-pct">20%</div>
                      <div className="cs-v2-pie-bar-wrap" style={{ marginTop: 6, marginBottom: 4 }}>
                        <div className="cs-v2-pie-bar-fill" style={{ width: "20%", height: "100%", background: "#93c5fd" }} />
                      </div>
                      <div className="cs-v2-pie-label">Enterprise &amp; mid-market &mdash; 5+ TIDs</div>
                    </div>
                  </div>
                </div>

                {/* Insight 05 */}
                <div className="cs-v2-insight">
                  <div className="cs-v2-insight-body">
                    <div className="cs-v2-insight-num">Insight 05</div>
                    <div className="cs-v2-insight-title">Over-reliance on the WhatsApp bot &mdash; which only worked 50% of the time</div>
                    <p className="cs-v2-insight-text">
                      The bot frequently displayed &ldquo;unable to support currently.&rdquo; It couldn&rsquo;t
                      collect data, didn&rsquo;t support un-mapping (deactivation), and had serious security
                      concerns. Every bot failure meant 45+ minutes on the call centre. FEs had stopped trusting it.
                    </p>
                  </div>
                  <div className="cs-v2-insight-imgs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/cs2/research/insight-5.jpg" alt="Razorpay POS WhatsApp support bot showing unable to support error" className="cs-v2-insight-img" />
                  </div>
                </div>

                {/* Insight 06 */}
                <div className="cs-v2-insight cs-v2-insight-stack">
                  <div className="cs-v2-insight-body">
                    <div className="cs-v2-insight-num">Insight 06</div>
                    <div className="cs-v2-insight-title">The Asti app (current solution) had fundamental experience and capability gaps</div>
                    <p className="cs-v2-insight-text">
                      Asti was a paid 3rd-party product &mdash; Razorpay had limited control over its roadmap.
                      It didn&rsquo;t support multiple device installation or deactivation. FEs faced confusing
                      user journeys, poor validation, poor error handling, a steep learning curve, and no iOS support.
                    </p>
                  </div>
                  <div className="cs-v2-insight-imgs cs-v2-insight-imgs-wide">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/cs2/research/insight-6a.jpg" alt="Asti app — Installation flow with fragmented fields" className="cs-v2-insight-img" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/cs2/research/insight-6b.jpg" alt="Asti app — Break Fix flow" className="cs-v2-insight-img" />
                  </div>
                </div>

                {/* ── METHODS ── */}
                <div className="cs-research-subsect">Research Methods</div>

                <p className="cs-sec p">
                  Before a single wireframe was drawn, I spent time in the field. Four methods &mdash;
                  ethnographic visits, a structured group discussion with 14 FEs, a call centre session,
                  and a service centre visit &mdash; each surfaced a distinct layer of the problem.
                </p>

                <div className="cs-v2-callout">
                  <div className="cs-v2-callout-label">Field visit observation &mdash; Bengaluru</div>
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
                  The Task Force App replaced the entire fragmented stack with one tool. Every surface was
                  designed around a real moment in the FE&rsquo;s day &mdash; from the morning attendance
                  swipe to ticket closure with merchant OTP.
                </p>

                {/* ── Screen count hero + marquee ── */}
                <div className="cs-v2-screen-hero">
                  <div className="cs-v2-screen-stats">
                    {[
                      ["60+", "Screens designed"],
                      ["7",   "Distinct flows"],
                      ["276", "Agents shipped to"],
                    ].map(([num, label]) => (
                      <div key={label} className="cs-v2-screen-stat">
                        <div className="cs-v2-screen-stat-num">{num}</div>
                        <div className="cs-v2-screen-stat-label">{label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Row 1 — left to right */}
                  <div className="cs-v2-marquee-wrap">
                    <div className="cs-v2-marquee cs-v2-marquee-fwd">
                      {([
                        "/cs2/get-started/1.png",
                        "/cs2/get-started/2.png",
                        "/cs2/get-started/3.png",
                        "/cs2/get-started/4.png",
                        "/cs2/get-started/5.png",
                        "/cs2/installation/Installation1.png",
                        "/cs2/installation/Installation2.png",
                        "/cs2/installation/Mapping3.png",
                        "/cs2/installation/Mapping4.png",
                        "/cs2/installation/Mapping6.png",
                        "/cs2/installation/Mapping13.png",
                        "/cs2/installation/Checklist1.png",
                        "/cs2/installation/Upload1.png",
                        "/cs2/installation/Validation1.png",
                        "/cs2/installation/Confirmation1.png",
                      ] as string[]).concat([
                        "/cs2/get-started/1.png",
                        "/cs2/get-started/2.png",
                        "/cs2/get-started/3.png",
                        "/cs2/get-started/4.png",
                        "/cs2/get-started/5.png",
                        "/cs2/installation/Installation1.png",
                        "/cs2/installation/Installation2.png",
                        "/cs2/installation/Mapping3.png",
                        "/cs2/installation/Mapping4.png",
                        "/cs2/installation/Mapping6.png",
                        "/cs2/installation/Mapping13.png",
                        "/cs2/installation/Checklist1.png",
                        "/cs2/installation/Upload1.png",
                        "/cs2/installation/Validation1.png",
                        "/cs2/installation/Confirmation1.png",
                      ]).map((src, i) => (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img key={i} src={src} alt="" className="cs-v2-marquee-img" />
                      ))}
                    </div>
                  </div>

                  {/* Row 2 — right to left */}
                  <div className="cs-v2-marquee-wrap">
                    <div className="cs-v2-marquee cs-v2-marquee-rev">
                      {([
                        "/cs2/deactivation/Deactivation1.png",
                        "/cs2/deactivation/Unmapping1.png",
                        "/cs2/deactivation/Unmapping5.png",
                        "/cs2/deactivation/Unmapping10.png",
                        "/cs2/deactivation/Validation1.png",
                        "/cs2/deactivation/Deactivation-confirmation.png",
                        "/cs2/edge-cases/Revisit1.png",
                        "/cs2/edge-cases/Revisit3.png",
                        "/cs2/edge-cases/Revisit5.png",
                        "/cs2/edge-cases/Revisit7.png",
                        "/cs2/edge-cases/Problematic1.png",
                        "/cs2/edge-cases/Problematic3.png",
                        "/cs2/edge-cases/Problematic5.png",
                        "/cs2/partial-txns/partial-test-txns1.png",
                        "/cs2/partial-txns/partial-test-txns3.png",
                        "/cs2/partial-txns/partial-test-txns5.png",
                        "/cs2/get-started/7.png",
                        "/cs2/get-started/8.png",
                        "/cs2/installation/Upload8.png",
                        "/cs2/installation/Validation3.png",
                      ] as string[]).concat([
                        "/cs2/deactivation/Deactivation1.png",
                        "/cs2/deactivation/Unmapping1.png",
                        "/cs2/deactivation/Unmapping5.png",
                        "/cs2/deactivation/Unmapping10.png",
                        "/cs2/deactivation/Validation1.png",
                        "/cs2/deactivation/Deactivation-confirmation.png",
                        "/cs2/edge-cases/Revisit1.png",
                        "/cs2/edge-cases/Revisit3.png",
                        "/cs2/edge-cases/Revisit5.png",
                        "/cs2/edge-cases/Revisit7.png",
                        "/cs2/edge-cases/Problematic1.png",
                        "/cs2/edge-cases/Problematic3.png",
                        "/cs2/edge-cases/Problematic5.png",
                        "/cs2/partial-txns/partial-test-txns1.png",
                        "/cs2/partial-txns/partial-test-txns3.png",
                        "/cs2/partial-txns/partial-test-txns5.png",
                        "/cs2/get-started/7.png",
                        "/cs2/get-started/8.png",
                        "/cs2/installation/Upload8.png",
                        "/cs2/installation/Validation3.png",
                      ]).map((src, i) => (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img key={i} src={src} alt="" className="cs-v2-marquee-img" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Surface 1 — Get Started */}
                <div className="cs-v2-surface">
                  <div className="cs-v2-surface-meta">
                    <span className="cs-v2-surface-num">Surface 1</span>
                    <span className="cs-v2-surface-role">Start of day</span>
                  </div>
                  <h3 className="cs-v2-surface-title">Login, Attendance &amp; Ticket Homepage</h3>
                  <p className="cs-sec p">
                    FEs open the app to a personalised greeting, see their full ticket count and type
                    breakdown, then mark attendance via a deliberate swipe &mdash; making the start of
                    the workday feel intentional. The homepage shows every ticket with colour-coded type,
                    TAT status (Overdue / 1 day left / 2 days left), distance, and estimated travel time.
                    Device and SIM inventory is visible at a glance, eliminating mismatches before an
                    agent even leaves for their first visit. No more WhatsApp lists. No more paper notes.
                  </p>
                  <PhoneSlideshow
                    slides={getStartedSlides}
                    flowLabel="Login → Attendance → Homepage → Inventory"
                  />
                </div>

                {/* Surface 2 — Installation */}
                <div className="cs-v2-surface">
                  <div className="cs-v2-surface-meta">
                    <span className="cs-v2-surface-num">Surface 2</span>
                    <span className="cs-v2-surface-role">Core flow</span>
                  </div>
                  <h3 className="cs-v2-surface-title">Installation &mdash; Scan, Map &amp; Close</h3>
                  <p className="cs-sec p">
                    The biggest workflow unlock. One ticket now contains multiple TIDs. All merchant and
                    device details are pre-populated &mdash; the agent confirms, scans, and proceeds.
                    Barcode scanning is the primary input for device serial numbers; manual entry is the
                    fallback. SIM numbers are manual-first (80&ndash;90% of SIM barcodes are absent in
                    the field). A celebratory animation plays after each device maps: <em>&ldquo;TID 1 of
                    2 mapped successfully!&rdquo;</em> &mdash; a moment of delight in a repetitive flow.
                  </p>
                  <p className="cs-sec p">
                    Compliance is baked in &mdash; not bolted on. The feature &amp; device checklist
                    ensures training is verified. Photo categories (shop board, inside view, device back)
                    are mandatory and contextual. A single merchant OTP covers all devices in the ticket,
                    replacing the old per-device WhatsApp flow. The closure screen digitally replaces the
                    physical DSC form.
                  </p>
                  <PhoneSlideshow
                    slides={installationSlides}
                    flowLabel="Ticket → Mapping → Checklist → Photos → OTP → Complete"
                  />
                  <FlowDiagram
                    src="/cs2/flows/installation-journey.png"
                    alt="Full installation flow diagram"
                    label="Full flow — Installation journey"
                  />
                </div>

                {/* Surface 3 — Deactivation */}
                <div className="cs-v2-surface">
                  <div className="cs-v2-surface-meta">
                    <span className="cs-v2-surface-num">Surface 3</span>
                    <span className="cs-v2-surface-role">Device removal</span>
                  </div>
                  <h3 className="cs-v2-surface-title">Deactivation &mdash; Unmap &amp; Collect</h3>
                  <p className="cs-sec p">
                    Deactivation mirrors the installation flow in reverse. The FE scans each device
                    to confirm identity, marks its status (working / not working / missing), and collects
                    accessories &mdash; all within a single ticket flow. The device status log creates an
                    audit trail that directly addresses the 8,000 device loss problem from the old stack.
                    One merchant OTP at the end covers all unmapped devices, and the completion screen
                    saves a deactivation copy for records.
                  </p>
                  <PhoneSlideshow
                    slides={deactivationSlides}
                    flowLabel="Ticket → Unmapping → Photos → OTP → Complete"
                  />
                  <FlowDiagram
                    src="/cs2/flows/deactivation-journey.png"
                    alt="Full deactivation flow diagram"
                    label="Full flow — Deactivation journey"
                  />
                </div>

                {/* Surface 4 — Servicing */}
                <div className="cs-v2-surface">
                  <div className="cs-v2-surface-meta">
                    <span className="cs-v2-surface-num">Surface 4</span>
                    <span className="cs-v2-surface-role">Device swap</span>
                  </div>
                  <h3 className="cs-v2-surface-title">Servicing &mdash; Deactivation + Installation in One</h3>
                  <p className="cs-sec p">
                    Servicing is a device swap: the old device is collected and unmapped, then a replacement
                    is installed and mapped &mdash; all within the same ticket. The app sequences this
                    naturally: Phase 1 runs the full deactivation flow (scan to confirm old device,
                    mark status, collect accessories), and Phase 2 runs the full installation flow (scan
                    new serial, SIM entry, test transaction, photo upload, merchant OTP). No duplicate data
                    entry. One ticket closure covers both.
                  </p>
                  <PhoneSlideshow
                    slides={servicingSlides}
                    flowLabel="Deactivation phase → Installation phase → Complete"
                  />
                  <FlowDiagram
                    src="/cs2/flows/servicing-journey.png"
                    alt="Full servicing flow diagram"
                    label="Full flow — Servicing journey"
                  />
                </div>

                {/* Surface 5 — Edge Cases */}
                <div className="cs-v2-surface">
                  <div className="cs-v2-surface-meta">
                    <span className="cs-v2-surface-num">Surface 5</span>
                    <span className="cs-v2-surface-role">Exception handling</span>
                  </div>
                  <h3 className="cs-v2-surface-title">Edge Cases &mdash; Revisit, Problematic &amp; Partial Txns</h3>
                  <p className="cs-sec p">
                    Not every visit goes to plan. These flows handle the three most common exceptions &mdash;
                    applicable across installation, deactivation, and servicing. Revisit is for merchant
                    unavailability: the agent selects a reschedule date and reason, which gets logged and
                    surfaced to the manager. Problematic is for permanent closures or wrong merchant flags,
                    with contact details captured for an ops audit trail. Partial test transactions handles
                    the edge case where a multi-device install has incomplete test txns &mdash; showing
                    per-TID progress and allowing partial closure.
                  </p>

                  <PhoneSlideshow
                    slides={revisitSlides}
                    flowLabel="Edge case — Revisit"
                  />
                  <PhoneSlideshow
                    slides={problematicSlides}
                    flowLabel="Edge case — Problematic"
                  />
                  <PhoneSlideshow
                    slides={partialTxnSlides}
                    flowLabel="Edge case — Partial test transactions"
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
