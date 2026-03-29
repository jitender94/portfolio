"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PhoneSlideshow from "./PhoneSlideshow";
import FlowDiagram from "./FlowDiagram";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SEC_IDS = ["tf-s01", "tf-s02", "tf-s03", "tf-s035", "tf-s04", "tf-s05", "tf-s06"];
const NAV_LABELS = ["Initial brief", "Research", "Problem", "Defining success", "Ideation", "Solution", "Outcome"];

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

  /* ── Scroll-triggered entrance animations ── */
  useEffect(() => {
    if (!isOpen) return;
    const overlay = overlayRef.current;
    if (!overlay) return;
    let observer: IntersectionObserver | undefined;
    // Delay until slide-in starts
    const timer = window.setTimeout(() => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) e.target.classList.add("is-visible");
          });
        },
        { root: overlay, threshold: 0.01, rootMargin: "0px 0px 0px 0px" }
      );
      const targets = overlay.querySelectorAll(
        ".cs-sec-v2, .cs-v2-insight, .cs-v2-surface, .cs-stat-hero-row, .cs-v2-persp-grid, .cs-v2-directions"
      );
      targets.forEach((el) => observer!.observe(el));
    }, 300);
    return () => {
      window.clearTimeout(timer);
      observer?.disconnect();
    };
  }, [isOpen]);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const getOffsetTop = (el: HTMLElement, container: HTMLElement): number => {
      let top = 0;
      let cur: HTMLElement | null = el;
      while (cur && cur !== container) {
        top += cur.offsetTop;
        cur = cur.offsetParent as HTMLElement | null;
      }
      return top;
    };
    const onScroll = () => {
      const scrollTop = overlay.scrollTop;
      const headerH = overlay.querySelector<HTMLElement>(".ol-header")?.offsetHeight ?? 57;
      const offset = headerH + 60;
      let current = SEC_IDS[0];
      SEC_IDS.forEach((id) => {
        const el = document.getElementById(id);
        if (el && getOffsetTop(el, overlay) - offset <= scrollTop) current = id;
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
    // Walk up offsetParent chain to get true offset within overlay
    let top = 0;
    let cur: HTMLElement | null = sec;
    while (cur && cur !== overlay) { top += cur.offsetTop; cur = cur.offsetParent as HTMLElement | null; }
    overlay.scrollTo({ top: top - headerH - progH - 16, behavior: "smooth" });
    // Force-reveal all animated elements in this section immediately so
    // content is never invisible when navigating via the progress nav
    sec.classList.add("is-visible");
    sec.querySelectorAll<HTMLElement>(
      ".cs-v2-surface, .cs-v2-insight, .cs-stat-hero-row, .cs-v2-persp-grid, .cs-v2-directions"
    ).forEach((el) => el.classList.add("is-visible"));
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
            <div className="cs-v2-cover-img" role="img" aria-label="Field agent holding Task Force App in front of a merchant" style={{ backgroundImage: "url('/cs2/hero-new.jpg')" }}>
            </div>
            <div className="cs-v2-cover-head">
              <div className="cs-tag">Razorpay &middot; 2025 &middot; Product Design</div>
              <h1 className="cs-v2-title">Task Force App</h1>
              <p className="cs-v2-hook">
                276 field agents were planning 10&ndash;15 merchant visits a day off WhatsApp messages
                and paper notes, using a bot that worked half the time and a vendor stack costing
                ₹7 lakh a month. We rebuilt the entire field operations experience from scratch ,
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

          {/* Sticky section progress nav — matches CS1 style */}
          <div className="cs-progress">
            {NAV_LABELS.map((label, i) => (
              <div
                key={i}
                className="cs-prog-step"
                data-sec={SEC_IDS[i]}
                onClick={() => scrollTo(SEC_IDS[i])}
              >
                0{i + 1} {label}
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="cs-v2-wrap">
            {/* Main content */}
            <div className="cs-v2-main">

              {/* ── 01 · Initial brief ── */}
              <div className="cs-sec-v2" id="tf-s01">
                <div className="cs-sec-v2-label">01 &middot; Initial brief</div>
                <h2 className="cs-sec-v2-h">
                  Field agents are the backbone of POS merchant onboarding. Their tools were failing them.
                </h2>
                <p className="cs-sec p">
                  The initial product brief surfaced systemic failures across analytics, operations, and
                  business metrics. Four critical gaps were identified — each compounding the others,
                  and each entirely preventable with the right tool.
                </p>

                <div className="cs-brief-cards">
                  {/* Card 1 */}
                  <div className="cs-brief-card">
                    <svg className="cs-brief-icon" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                      <circle cx="20" cy="20" r="15" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M20 12v8l5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <div className="cs-brief-stat">60+ min</div>
                    <div className="cs-brief-title">Installation bottlenecks</div>
                    <div className="cs-brief-desc">Enterprise installations were taking 60+ minutes. Fragmented workflows across tools meant agents re-entered data multiple times with no single source of truth.</div>
                  </div>
                  {/* Card 2 */}
                  <div className="cs-brief-card">
                    <svg className="cs-brief-icon" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                      <rect x="6" y="12" width="28" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M14 12V10a6 6 0 0112 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M20 22v-4M18 20h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <div className="cs-brief-stat">₹7L/month</div>
                    <div className="cs-brief-title">Vendor dependency</div>
                    <div className="cs-brief-desc">The Asti + TAMS stack cost ₹7L/month and chronically underperformed. The WhatsApp bot fallback worked ~50% of the time — agents had stopped trusting both tools.</div>
                  </div>
                  {/* Card 3 */}
                  <div className="cs-brief-card">
                    <svg className="cs-brief-icon" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                      <rect x="10" y="8" width="20" height="26" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M15 16h10M15 21h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      <circle cx="27" cy="29" r="5" fill="var(--cs-bg)" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M27 27v2.5l1.5 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                    <div className="cs-brief-stat">8,000</div>
                    <div className="cs-brief-title">Zero device accountability</div>
                    <div className="cs-brief-desc">8,000 devices left merchant premises with no validation or trackability — resulting in a ₹1 Cr P&L hit. No audit trail. No way to know where devices went.</div>
                  </div>
                  {/* Card 4 */}
                  <div className="cs-brief-card">
                    <svg className="cs-brief-icon" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                      <path d="M20 8C13.37 8 8 12.48 8 18c0 3.18 1.74 6.01 4.5 7.9V30l4.5-2.5c1 .3 2 .5 3 .5 6.63 0 12-4.48 12-10S26.63 8 20 8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                      <path d="M15 18h10M15 22h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <div className="cs-brief-stat">7.5%</div>
                    <div className="cs-brief-title">Post-closure service violations</div>
                    <div className="cs-brief-desc">7.5% of closed tickets had service violations raised within 7 days — a signal that closures were happening without proper verification or merchant sign-off.</div>
                  </div>
                </div>

                {/* Additional context — operational issues */}
                <ul className="cs-brief-points">
                  <li>The old stack ran on two vendors: SAP B1 via TAMS (backend) and Asti (frontend). Asti had persistent technical issues — agents stopped trusting it entirely.</li>
                  <li>The WhatsApp bot fallback worked ~50% of the time. When it failed, agents called Customer Support, adding 45+ minutes to what should have been a 5-minute task.</li>
                  <li>Each agent visit cost Razorpay <strong>₹280</strong>. Repeat visits caused purely by tool failures compounded directly into P&amp;L.</li>
                  <li>Merchant CSAT after field resolution hovered at ~80%, with no mechanism to verify installations or explain device issues. Devices left premises without any trackability check.</li>
                </ul>
              </div>

              {/* ── 02 · Research ── */}
              <div className="cs-sec-v2" id="tf-s02">
                <div className="cs-sec-v2-label">02 &middot; Research</div>
                <h2 className="cs-sec-v2-h">
                  Going to the field made it clear - the problem wasn&rsquo;t just the tools. It was the entire process.
                </h2>
                <p className="cs-sec p">
                  The PRD gave us the what. I needed the why. So before locking any problem statement,
                  I went to the field — shadowed agents, ran group discussions, sat with the call centre.
                  What I found changed the entire framing.
                </p>

                {/* ── CONTEXT ── */}
                <div className="cs-research-subsect">Context</div>

                {/* Who is a Field Executive */}
                <h3 className="cs-v2-surface-title" style={{ marginBottom: 12 }}>Who is a Field Executive (FE)?</h3>
                <p className="cs-sec p">
                  A field engineer is someone who visits offline merchants to resolve tickets in person.
                  FEs are assigned to specific areas within a city tickets are routed to them
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

                {/* ── METHODS ── */}
                <div className="cs-research-subsect">Research Methods</div>

                <div className="cs-v2-callout">
                  <div className="cs-v2-callout-label">Field visit observation · Bengaluru</div>
                  <div className="cs-v2-callout-text">
                    Every morning, agents received a WhatsApp message from their team lead — a list of
                    merchant names, ticket numbers, and pincodes. They copied this onto paper. Sorted by
                    pincode. That was their route plan.
                  </div>
                </div>

                <p className="cs-sec p">
                  <strong>Method 1: Field Visits (Ethnographic Research)</strong>
                </p>
                <p className="cs-sec p">
                  I shadowed 2 FEs across different zones in Bengaluru through actual merchant visits.
                  What I observed shaped every major design decision that followed.
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
                  <strong>Method 2: Group Discussion with 14 Field Engineers</strong>
                </p>
                <p className="cs-sec p">
                  A cross-functional session at the Bengaluru FE hub. New tickets mid-day disrupted planned routes.
                  Agents sometimes visited the same location twice on separate tickets. 10&ndash;20% of pre-visit calls
                  found the ticket was raised by mistake — a wasted trip before it began.
                </p>

                <div className="cs-pullquote">
                  <div className="cs-pullquote-text">
                    &ldquo;50% success rate on the bot is normal for us. When it fails we call support —
                    45 minutes, sometimes more.&rdquo;
                  </div>
                  <div className="cs-pullquote-cite">Field Engineer group discussion, Kalyan Nagar</div>
                </div>

                <p className="cs-sec p">
                  <strong>Method 3: Call Centre Agent Session</strong>
                </p>
                <p className="cs-sec p">
                  ~50% of inbound calls were about battery life, ~30% network issues. Agents hopped across
                  3&ndash;4 portals per call with no SOPs. A 48-hour resolution SLA was committed to merchants,
                  but FEs regularly took 3&ndash;4 days — a trust gap enabled by zero digital accountability.
                  Merchant CSAT dropped from ~80% in July 2024 to 72% by December.
                </p>

                {/* ── INSIGHTS ── */}
                <div className="cs-research-subsect">Research Insights</div>

                {/* Insight 01 */}
                <div className="cs-v2-insight cs-v2-insight-dual">
                  <div className="cs-v2-insight-body">
                    <div className="cs-v2-insight-num">Insight 01</div>
                    <div className="cs-v2-insight-title">FE day planning: receiving and prioritising tickets is a cumbersome process</div>
                    <p className="cs-v2-insight-text">
                      WhatsApp ticket list, copied to paper and re-sorted by pincode — any mid-day addition broke the plan.
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
                    <div className="cs-v2-insight-title">The process is not completely digital — physical service forms are still in use</div>
                    <p className="cs-v2-insight-text">
                      Every visit required a handwritten service form — submitted at EOD and re-entered manually, creating delays and transcription errors.
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
                      Mandatory in theory, skipped under time pressure — merchants left to figure out their own devices.
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
                    <div className="cs-v2-insight-title">80% of tickets are retail but the 20% enterprise takes disproportionate time</div>
                    <p className="cs-v2-insight-text">
                      80% retail volume — but a single enterprise ticket could require 15 separate bot sessions.
                    </p>
                  </div>
                  <div className="cs-v2-pie">
                    <div>
                      <div className="cs-v2-pie-pct">80%</div>
                      <div className="cs-v2-pie-bar-wrap" style={{ marginTop: 6, marginBottom: 4 }}>
                        <div className="cs-v2-pie-bar-fill" style={{ width: "80%", height: "100%", background: "#1657d4" }} />
                      </div>
                      <div className="cs-v2-pie-label">Retail · 1 to 5 TIDs</div>
                    </div>
                    <div>
                      <div className="cs-v2-pie-pct">20%</div>
                      <div className="cs-v2-pie-bar-wrap" style={{ marginTop: 6, marginBottom: 4 }}>
                        <div className="cs-v2-pie-bar-fill" style={{ width: "20%", height: "100%", background: "#93c5fd" }} />
                      </div>
                      <div className="cs-v2-pie-label">Enterprise &amp; mid-market · 5+ TIDs</div>
                    </div>
                  </div>
                </div>

                {/* Insight 05 */}
                <div className="cs-v2-insight">
                  <div className="cs-v2-insight-body">
                    <div className="cs-v2-insight-num">Insight 05</div>
                    <div className="cs-v2-insight-title">Over-reliance on the WhatsApp bot which only worked 50% of the time</div>
                    <p className="cs-v2-insight-text">
                      Frequent errors, no deactivation support, security gaps — every failure added 45+ min via the call centre. FEs had stopped trusting it.
                    </p>
                  </div>
                  <div className="cs-v2-insight-imgs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/cs2/research/insight-5.jpg" alt="Razorpay POS WhatsApp support bot showing unable to support error" className="cs-v2-insight-img" />
                  </div>
                </div>

                {/* Insight 06 */}
                <div className="cs-v2-insight cs-v2-insight-dual">
                  <div className="cs-v2-insight-body">
                    <div className="cs-v2-insight-num">Insight 06</div>
                    <div className="cs-v2-insight-title">The Asti app (current solution) had fundamental experience and capability gaps</div>
                    <p className="cs-v2-insight-text">
                      No multi-device support, no deactivation, confusing flows, no iOS — a paid tool Razorpay couldn&rsquo;t roadmap, at ₹7L/month.
                    </p>
                  </div>
                  <div className="cs-v2-insight-imgs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/cs2/research/insight-6a.jpg" alt="Asti app — Installation flow with fragmented fields" className="cs-v2-insight-img" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/cs2/research/insight-6b.jpg" alt="Asti app — Break Fix flow" className="cs-v2-insight-img" />
                  </div>
                </div>
              </div>

              {/* ── 03 · Problem ── */}
              <div className="cs-sec-v2" id="tf-s03">
                <div className="cs-sec-v2-label">03 &middot; Problem</div>
                <h2 className="cs-sec-v2-h">
                  The problems ran deeper than any single tool. Agents, merchants, and Razorpay were all losing trust in the same system.
                </h2>

                <p className="cs-sec p">
                  Research synthesis bucketed the problems into three perspectives. Framing it this way
                  changed the design conversation from &ldquo;make the bot better&rdquo; to &ldquo;rebuild
                  the entire field experience.&rdquo;
                </p>

                <div className="cs-v2-persp-grid">
                  {/* FE perspective */}
                  <div className="cs-v2-persp-card">
                    <div className="cs-v2-persp-header">
                      <svg className="cs-v2-persp-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                      </svg>
                      <span className="cs-v2-persp-title">From the FE&rsquo;s perspective</span>
                    </div>
                    <ul className="cs-v2-persp-list">
                      <li>Routes planned off WhatsApp + handwritten paper</li>
                      <li>1 device per ticket → 5–15 bot sessions for enterprise</li>
                      <li>Bot worked ~50% of the time</li>
                      <li>Manual MID/TID entry on every visit</li>
                      <li>Zero device trackability</li>
                    </ul>
                  </div>
                  {/* Merchant perspective */}
                  <div className="cs-v2-persp-card">
                    <div className="cs-v2-persp-header">
                      <svg className="cs-v2-persp-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                      </svg>
                      <span className="cs-v2-persp-title">From the Merchant&rsquo;s perspective</span>
                    </div>
                    <ul className="cs-v2-persp-list">
                      <li>60+ min installs for enterprise setups</li>
                      <li>No device training or usage explanation</li>
                      <li>SIM vs WiFi issues left unresolved</li>
                      <li>No post-install verification</li>
                      <li>No Razorpay brand touchpoint at closure</li>
                    </ul>
                  </div>
                  {/* Razorpay perspective */}
                  <div className="cs-v2-persp-card">
                    <div className="cs-v2-persp-header">
                      <svg className="cs-v2-persp-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                      </svg>
                      <span className="cs-v2-persp-title">From Razorpay&rsquo;s perspective</span>
                    </div>
                    <ul className="cs-v2-persp-list">
                      <li>₹7L/month on vendors agents had stopped trusting</li>
                      <li>8,000 devices lost → ₹1 Cr P&amp;L hit</li>
                      <li>No real-time FE visibility or route planning</li>
                      <li>Zero compliance enforcement or audit trail</li>
                      <li>Repeat visits at ₹280/trip bleeding operations</li>
                    </ul>
                  </div>
                </div>

                <div className="cs-v2-callout">
                  <div className="cs-v2-callout-label">North Star</div>
                  <div className="cs-v2-callout-text">
                    &ldquo;A field agent should complete a device installation in under 5 minutes ,
                    with full compliance, zero manual data entry, and a merchant who knows exactly what
                    they&rsquo;ve signed up for.&rdquo;
                  </div>
                </div>

                <div className="cs-v2-hmw">
                  <div className="cs-v2-hmw-label">How might we</div>
                  <div className="cs-v2-hmw-text">
                    How do we design a field tool that helps agents work without friction, gives merchants a
                    trustworthy experience at every visit, and gives Razorpay the real-time visibility it
                    needs, without adding overhead to anyone&rsquo;s day?
                  </div>
                </div>
              </div>

              {/* ── 03.5 · Defining success ── */}
              <div className="cs-sec-v2" id="tf-s035">
                <div className="cs-sec-v2-label">Defining success</div>
                <h2 className="cs-sec-v2-h">
                  We defined what success looks like before we ideated solutions.
                </h2>
                <p className="cs-sec p">
                  Before moving to solutions, we defined success from every angle. A product that only helped
                  the FE but ignored the merchant experience or helped compliance but frustrated
                  agents would fail in the field.
                </p>
                <div className="cs-v2-success-grid">
                  {[
                    ["Reduces manual effort", "FEs receive a pre-populated task list with merchant details, device info, and route context upfront — eliminating the daily WhatsApp copy-paste and handwritten planning."],
                    ["Improves FE efficiency", "Multiple devices serviced in a single ticket with scan-first mapping and auto-filled fields — so enterprise visits that took 60+ minutes complete in under 5."],
                    ["Reduces ticket TAT", "Digital ownership of every task means no undocumented delays. Tickets close faster and on-time rates improve, directly lifting Merchant CSAT."],
                    ["Gives Razorpay visibility", "Every action — photo proof, device validation, merchant OTP, digital signature — is captured in real time. Zero compliance gaps, and 8,000 device losses become preventable."],
                    ["Gives delight", "Micro-interactions, illustrations, and continuous in-app feedback make the journey feel rewarding rather than bureaucratic — because agents who trust the tool will actually use it."],
                  ].map(([heading, desc]) => (
                    <div key={heading} className="cs-v2-success-card">
                      <div className="cs-v2-success-heading">{heading}</div>
                      <div className="cs-v2-success-desc">{desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── 04 · Ideation ── */}
              <div className="cs-sec-v2" id="tf-s04">
                <div className="cs-sec-v2-label">04 &middot; Ideation</div>
                <h2 className="cs-sec-v2-h">
                  The hardest decision was not what to design. It was deciding what kind of product we were building at all.
                </h2>

                <p className="cs-sec p">
                  Before screens, the strategic question was what kind of product to build a patch
                  on Asti, an extension of the WhatsApp bot, or a ground-up replacement. Three directions
                  were evaluated.
                </p>

                <div className="cs-directions">
                  <div className="cs-dir killed">
                    <div className="cs-dir-letter">A</div>
                    <div className="cs-dir-body">
                      <div className="cs-dir-title">Patch Asti + improve the WhatsApp bot</div>
                      <div className="cs-dir-desc">Fix the existing tools. Reduce validation errors. Improve bot reliability. Killed early, as agents had already lost trust in both tools. You can&rsquo;t design trust back into a product people associate with failure.</div>
                      <div className="cs-dir-verdict">✕ Killed: wrong foundation</div>
                    </div>
                  </div>
                  <div className="cs-dir killed">
                    <div className="cs-dir-letter">B</div>
                    <div className="cs-dir-body">
                      <div className="cs-dir-title">Better frontend wrapper on existing backend</div>
                      <div className="cs-dir-desc">A polished frontend over the same SAP B1 backend. Eliminated when engineering confirmed the backend was being migrated to SAP HANA. Building a wrapper would mean rebuilding the frontend twice within 1&ndash;2 quarters.</div>
                      <div className="cs-dir-verdict">✕ Killed: tech debt would follow</div>
                    </div>
                  </div>
                  <div className="cs-dir chosen">
                    <div className="cs-dir-letter">C</div>
                    <div className="cs-dir-body">
                      <div className="cs-dir-title">Ground-up Task Force App with smart task management</div>
                      <div className="cs-dir-desc">Full replacement of Asti and the WhatsApp bot. Pre-populated task list, multi-device single-ticket mapping, barcode scan-first workflows, compliance enforcement, and inventory visibility, all in one reliable tool. Aligned with the SAP HANA migration roadmap. Eliminates vendor costs. Earns agent trust through reliability.</div>
                      <div className="cs-dir-verdict">✓ Chosen: clean slate, new trust, vendor eliminated</div>
                    </div>
                  </div>
                </div>

                <p className="cs-sec p">
                  <strong>Key design decisions</strong>
                </p>

                <div className="cs-personas" style={{ marginBottom: 32 }}>
                  {[
                    ["Swipe to Start", "Originally attendance-only. Evolved into a dual-purpose surface — today's task count + type breakdown — so agents have a full day overview before they leave. The swipe (vs tap) marks the psychological start of the workday."],
                    ["Homepage — 8–10 iterations", "Balancing task list with priority, TAT, distance, and inventory at a glance. The hardest information-density problem: a screen used while standing in a merchant's shop."],
                    ["Device Mapping", "Progressive disclosure + scan-first + a success animation after each device maps. Made a multi-step, high-pressure flow feel manageable and even rewarding."],
                    ["SIM scan as secondary", "Initial assumption: scan-first for SIM too. User testing revealed 80–90% of SIM barcodes are absent in the field. Manual became primary; scan became the faster fallback."],
                  ].map(([name, sub]) => (
                    <div key={name} className="cs-persona">
                      <div className="cs-persona-name">{name}</div>
                      <div className="cs-persona-sub">{sub}</div>
                    </div>
                  ))}
                </div>

                <p className="cs-sec p">
                  <strong>User Testing</strong>
                </p>
                <p className="cs-sec p">
                  Round 1 (guerrilla, 3 FEs): surfaced validation error edge cases, photo capture friction,
                  and SIM unlinking issues during breakfix. Round 2 (Dec 13, 14 FEs at Razorpay office):
                  all feedback actioned — SIM scan made secondary, progress bar reduced in prominence,
                  &ldquo;RRN&rdquo; renamed to &ldquo;Transaction Number&rdquo;, priority badge added,
                  photo upload redesigned with stronger tap affordance.
                </p>
              </div>

              {/* ── 05 · Solution ── */}
              <div className="cs-sec-v2" id="tf-s05">
                <div className="cs-sec-v2-label">05 &middot; Solution</div>
                <h2 className="cs-sec-v2-h">
                  One app for the entire day. Built around what field engineers actually do.
                </h2>

                <p className="cs-sec p">
                  The Task Force App replaced the entire fragmented stack with one tool. Every surface was
                  designed around a real moment in the FE&rsquo;s day from the morning attendance
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

                  {/* Single row — all screens */}
                  <div className="cs-v2-marquee-wrap">
                    <div className="cs-v2-marquee cs-v2-marquee-fwd">
                      {([
                        "/cs2/get-started/1.png",
                        "/cs2/get-started/2.png",
                        "/cs2/get-started/3.png",
                        "/cs2/get-started/4.png",
                        "/cs2/get-started/5.png",
                        "/cs2/get-started/7.png",
                        "/cs2/get-started/8.png",
                        "/cs2/installation/Installation1.png",
                        "/cs2/installation/Installation2.png",
                        "/cs2/installation/Mapping3.png",
                        "/cs2/installation/Mapping4.png",
                        "/cs2/installation/Mapping6.png",
                        "/cs2/installation/Mapping13.png",
                        "/cs2/installation/Checklist1.png",
                        "/cs2/installation/Upload1.png",
                        "/cs2/installation/Upload8.png",
                        "/cs2/installation/Validation1.png",
                        "/cs2/installation/Validation3.png",
                        "/cs2/installation/Confirmation1.png",
                        "/cs2/deactivation/Deactivation1.png",
                        "/cs2/deactivation/Unmapping1.png",
                        "/cs2/deactivation/Unmapping5.png",
                        "/cs2/deactivation/Unmapping10.png",
                        "/cs2/deactivation/Validation1.png",
                        "/cs2/deactivation/Deactivation-confirmation.png",
                        "/cs2/edge-cases/Revisit1.png",
                        "/cs2/edge-cases/Revisit3.png",
                        "/cs2/edge-cases/Revisit7.png",
                        "/cs2/edge-cases/Problematic1.png",
                        "/cs2/edge-cases/Problematic5.png",
                        "/cs2/partial-txns/partial-test-txns1.png",
                        "/cs2/partial-txns/partial-test-txns3.png",
                        "/cs2/partial-txns/partial-test-txns5.png",
                      ] as string[]).concat([
                        "/cs2/get-started/1.png",
                        "/cs2/get-started/2.png",
                        "/cs2/get-started/3.png",
                        "/cs2/get-started/4.png",
                        "/cs2/get-started/5.png",
                        "/cs2/get-started/7.png",
                        "/cs2/get-started/8.png",
                        "/cs2/installation/Installation1.png",
                        "/cs2/installation/Installation2.png",
                        "/cs2/installation/Mapping3.png",
                        "/cs2/installation/Mapping4.png",
                        "/cs2/installation/Mapping6.png",
                        "/cs2/installation/Mapping13.png",
                        "/cs2/installation/Checklist1.png",
                        "/cs2/installation/Upload1.png",
                        "/cs2/installation/Upload8.png",
                        "/cs2/installation/Validation1.png",
                        "/cs2/installation/Validation3.png",
                        "/cs2/installation/Confirmation1.png",
                        "/cs2/deactivation/Deactivation1.png",
                        "/cs2/deactivation/Unmapping1.png",
                        "/cs2/deactivation/Unmapping5.png",
                        "/cs2/deactivation/Unmapping10.png",
                        "/cs2/deactivation/Validation1.png",
                        "/cs2/deactivation/Deactivation-confirmation.png",
                        "/cs2/edge-cases/Revisit1.png",
                        "/cs2/edge-cases/Revisit3.png",
                        "/cs2/edge-cases/Revisit7.png",
                        "/cs2/edge-cases/Problematic1.png",
                        "/cs2/edge-cases/Problematic5.png",
                        "/cs2/partial-txns/partial-test-txns1.png",
                        "/cs2/partial-txns/partial-test-txns3.png",
                        "/cs2/partial-txns/partial-test-txns5.png",
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
                    breakdown, then mark attendance via a deliberate swipe making the start of
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
                  <h3 className="cs-v2-surface-title">Installation: Scan, Map and Close</h3>
                  <p className="cs-sec p">
                    The biggest workflow unlock. One ticket now contains multiple TIDs. All merchant and
                    device details are pre-populated the agent confirms, scans, and proceeds.
                    Barcode scanning is the primary input for device serial numbers; manual entry is the
                    fallback. SIM numbers are manual-first (80&ndash;90% of SIM barcodes are absent in
                    the field). A celebratory animation plays after each device maps: <em>&ldquo;TID 1 of
                    2 mapped successfully!&rdquo;</em> a moment of delight in a repetitive flow.
                  </p>
                  <p className="cs-sec p">
                    Compliance is baked in, not bolted on. The feature &amp; device checklist
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
                  <h3 className="cs-v2-surface-title">Deactivation: Unmap and Collect</h3>
                  <p className="cs-sec p">
                    Deactivation mirrors the installation flow in reverse. The FE scans each device
                    to confirm identity, marks its status (working / not working / missing), and collects
                    accessories all within a single ticket flow. The device status log creates an
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
                  <h3 className="cs-v2-surface-title">Servicing: Deactivation into Installation, in one ticket</h3>
                  <p className="cs-sec p">
                    Servicing is a device swap: the old device is collected and unmapped, then a replacement
                    is installed and mapped all within the same ticket. The app sequences this
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
                  <h3 className="cs-v2-surface-title">Edge Cases: Revisit, Problematic and Partial Transactions</h3>
                  <p className="cs-sec p">
                    Not every visit goes to plan. These flows handle the three most common exceptions ,
                    applicable across installation, deactivation, and servicing. Revisit is for merchant
                    unavailability: the agent selects a reschedule date and reason, which gets logged and
                    surfaced to the manager. Problematic is for permanent closures or wrong merchant flags,
                    with contact details captured for an ops audit trail. Partial test transactions handles
                    the edge case where a multi-device install has incomplete test txns showing
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
                    <strong>UX goodness: moments designed to go beyond functional</strong>
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
                  <h3 className="cs-v2-surface-title">QR Activation: 60 days reduced to 1</h3>
                  <p className="cs-sec p">
                    The Task Force App was extended beyond POS devices to handle QR activations across all
                    device types (WD10, AP101A, Soundbox, Stickers) for both OMNI and non-OMNI stacks via
                    configurable feature flags. Previously, setting up activation flows for a new bank
                    required 60&ndash;100 engineering days. With modular feature flags that auto-adapt to
                    device type and bank specifications this dropped to under 1 day.
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
                  Shipped to all 276 agents across India in May 2025. Here is what the data showed.
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
                  8.8 to 11.5 tickets closed per day a <strong>30.3% improvement</strong> for
                  the most productive segment of the field team.
                </p>

                <p className="cs-sec p">
                  Service violations (SVs) raised within 7 days of ticket closure dropped from
                  <strong> 7.5% → 5.9%</strong> (&minus;1.6pp). QR activation setup time for new banks
                  went from 60&ndash;100 engineering days to under 1 day. ₹24 lakh/year saved by
                  eliminating the Asti vendor with an additional ₹60 lakh/year in savings
                  expected once SAP B1 → SAP HANA migration completes in the next 1&ndash;2 quarters.
                  100% of new-bank QR activations now run through the unified app.
                </p>

                <div className="cs-v2-reflect">
                  <div className="cs-v2-reflect-item">
                    <div className="cs-v2-reflect-label">What worked</div>
                    <p>Going to the field before the first wireframe. The paper notepad, the physical service form, the WhatsApp bot screenshot these weren&rsquo;t data points, they were the design brief. Every decision was traceable to something seen or heard on those visits. The decision to treat the agent app as a consumer-grade product not a utility tool paid off in adoption speed. 40% of agents adopted it in a single day.</p>
                  </div>
                  <div className="cs-v2-reflect-item">
                    <div className="cs-v2-reflect-label">What I&rsquo;d do differently</div>
                    <p>Push harder for map/route planning in the first release. Research showed it clearly agents were visiting the same location twice because ticket aggregation by location wasn&rsquo;t available. I deprioritised it to ship faster. The multi-device mapping flow was also the hardest design problem I&rsquo;ve faced; I&rsquo;d prototype the scan interaction in code much earlier, before committing to Figma frames, to surface the state-management complexity sooner.</p>
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
