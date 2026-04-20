"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SEC_IDS  = ["p2-s01", "p2-s02", "p2-s03", "p2-s04"];
const NAV_LABELS = ["Context", "Problem", "Solution", "Outcome"];

export default function CaseStudy2P2({ isOpen, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) { window.history.pushState({ overlay: "cs2p2" }, ""); }
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

  /* Scroll-triggered animations */
  useEffect(() => {
    if (!isOpen) return;
    const overlay = overlayRef.current;
    if (!overlay) return;
    let observer: IntersectionObserver | undefined;
    const timer = window.setTimeout(() => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("is-visible"); });
        },
        { root: overlay, threshold: 0.01 }
      );
      overlay.querySelectorAll(".cs-sec-v2, .cs-stat-hero-row, .cs-v2-persp-grid").forEach((el) =>
        observer!.observe(el)
      );
    }, 300);
    return () => { window.clearTimeout(timer); observer?.disconnect(); };
  }, [isOpen]);

  /* Progress nav scroll tracking */
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const getOffsetTop = (el: HTMLElement, container: HTMLElement): number => {
      let top = 0;
      let cur: HTMLElement | null = el;
      while (cur && cur !== container) { top += cur.offsetTop; cur = cur.offsetParent as HTMLElement | null; }
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
    let top = 0;
    let cur: HTMLElement | null = sec;
    while (cur && cur !== overlay) { top += cur.offsetTop; cur = cur.offsetParent as HTMLElement | null; }
    overlay.scrollTo({ top: top - headerH - progH - 16, behavior: "smooth" });
    sec.classList.add("is-visible");
    sec.querySelectorAll<HTMLElement>(".cs-stat-hero-row, .cs-v2-persp-grid").forEach((el) =>
      el.classList.add("is-visible")
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="overlay"
          id="cs2p2"
          ref={overlayRef}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }}
        >
          {/* Header */}
          <div className="ol-header">
            <button className="ol-back" onClick={onClose}>&larr; Back to portfolio</button>
            <span className="ol-num">Case Study 02 &middot; Phase 2</span>
          </div>

          {/* Progress nav */}
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

          {/* Cover */}
          <div className="cs-v2-cover">
            <div
              className="cs-v2-cover-img"
              role="img"
              aria-label="Task Force App — QR Activation extension"
              style={{ backgroundImage: "url('/cs2/hero-new.jpg')", filter: "brightness(0.85) hue-rotate(10deg)" }}
            />
            <div className="cs-v2-cover-head">
              <div className="cs-tag">Razorpay &middot; 2025 &middot; Phase 2 Extension</div>
              <h1 className="cs-v2-title">Task Force App<br /><em style={{ fontStyle: "normal", fontSize: "0.6em", opacity: 0.6, fontWeight: 400 }}>QR Activation</em></h1>
              <p className="cs-v2-hook">
                With the core field operations platform live, the next challenge was clear:
                new-bank QR activations were still running through a separate, disconnected
                process. Phase 2 unified it — 100% of new-bank QR activations now run through
                the Task Force App.
              </p>
            </div>
            <div className="cs-v2-overview">
              {[
                ["Phase", "Extension to Phase 1 (Task Force App)"],
                ["Timeline", "3 weeks (after Phase 1 completion)"],
                ["Platform", "PWA (Progressive Web App)"],
                ["Impact", "100% QR activations unified"],
              ].map(([k, v]) => (
                <div className="cs-v2-overview-item" key={k}>
                  <div className="cs-v2-overview-key">{k}</div>
                  <div className="cs-v2-overview-val">{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="cs-v2-wrap">
            <div className="cs-v2-main">

              {/* ── 01 · Context ── */}
              <div className="cs-sec-v2" id="p2-s01">
                <div className="cs-sec-v2-label">01 &middot; Context</div>
                <h2 className="cs-sec-v2-h">
                  Phase 1 solved field operations. One flow remained outside the app.
                </h2>
                <p className="cs-sec p">
                  After Phase 1 launched — covering installation, deactivation, and servicing — field
                  agents were using the Task Force App for most of their day. But QR code activations
                  for new-bank onboarding still happened through a separate, manual process: WhatsApp
                  instructions, paper logs, and an external system the ops team had no visibility into.
                </p>
                <p className="cs-sec p">
                  The problem was identical to what Phase 1 had fixed everywhere else. The solution
                  had the same shape: bring it into the unified app, with the same scan-first,
                  merchant-OTP-verified, photo-documented flow the agents already knew.
                </p>

                {/* Context stat cards */}
                <div className="cs-stat-hero-row cs-stat-hero-row--problem" style={{ marginTop: 40 }}>
                  {[
                    ["Separate", "QR activations ran through a fully disconnected process"],
                    ["0%", "Digital audit trail for QR activations before Phase 2"],
                    ["Unified", "Single app for all field operations post-launch"],
                    ["100%", "New-bank QR activations through the Task Force App"],
                  ].map(([num, label]) => (
                    <div className="cs-stat-hero" key={num}>
                      <div className="cs-stat-hero-num">{num}</div>
                      <div className="cs-stat-hero-label">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── 02 · Problem ── */}
              <div className="cs-sec-v2" id="p2-s02">
                <div className="cs-sec-v2-label">02 &middot; Problem</div>
                <h2 className="cs-sec-v2-h">
                  QR activation was the last manual island in a now-digital workflow.
                </h2>
                <p className="cs-sec p">
                  New-bank QR onboarding required a field agent to visit the merchant, generate a QR
                  code through a separate banking portal, print or share it, and log the completion
                  manually on WhatsApp. There was no structured ticket, no photo documentation, and
                  no digital confirmation from the merchant.
                </p>

                <div className="cs-v2-persp-grid" style={{ marginTop: 32 }}>
                  {[
                    {
                      icon: (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/>
                        </svg>
                      ),
                      label: "FIELD AGENT",
                      title: "Split workflow, double effort",
                      points: [
                        "Switching between two apps mid-visit broke the flow",
                        "QR generation required a banking portal login the app didn't have",
                        "No way to log completion — relied on WhatsApp confirmation",
                        "If QR wasn't generated correctly, there was no retry path",
                      ],
                    },
                    {
                      icon: (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                      ),
                      label: "OPS / MANAGER",
                      title: "No visibility, no audit trail",
                      points: [
                        "QR activation completions were only tracked in WhatsApp threads",
                        "No photo proof of QR placement at the merchant location",
                        "Could not distinguish between 'done', 'pending', and 'failed'",
                        "Reconciliation with bank data was a manual, weekly process",
                      ],
                    },
                    {
                      icon: (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                        </svg>
                      ),
                      label: "MERCHANT",
                      title: "Activation without confirmation",
                      points: [
                        "No official confirmation that QR was active and ready to use",
                        "No training material shared at the point of activation",
                        "Disputes over 'was it activated?' had no resolution path",
                        "First-use anxiety — no one explained how to accept payments",
                      ],
                    },
                  ].map((card) => (
                    <div className="cs-v2-persp-card" key={card.label}>
                      <div className="cs-v2-persp-header">
                        <svg className="cs-v2-persp-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          {card.icon.props.children}
                        </svg>
                        <span className="cs-v2-persp-title">{card.label}</span>
                      </div>
                      <div style={{ fontFamily: "var(--body)", fontSize: 15, fontWeight: 600, color: "var(--cs-text)", marginBottom: 12 }}>{card.title}</div>
                      <ul className="cs-v2-persp-list">
                        {card.points.map((p) => <li key={p}>{p}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── 03 · Solution ── */}
              <div className="cs-sec-v2" id="p2-s03">
                <div className="cs-sec-v2-label">03 &middot; Solution</div>
                <h2 className="cs-sec-v2-h">
                  QR activation as a first-class ticket type — same patterns, new surface.
                </h2>
                <p className="cs-sec p">
                  Rather than building a separate flow, the QR activation surface was designed to
                  feel like a natural extension of the ticket types agents already knew. The structure
                  follows the same pattern: ticket details → activation steps → photo documentation →
                  merchant confirmation.
                </p>

                {/* Surface: QR Activation */}
                <div className="cs-v2-surface">
                  <div className="cs-v2-surface-meta">
                    <span className="cs-v2-surface-num">Surface 1</span>
                    <span className="cs-v2-surface-role">New-bank QR onboarding</span>
                  </div>
                  <h3 className="cs-v2-surface-title">QR Activation: Generate, Place, Confirm</h3>
                  <p className="cs-sec p">
                    The QR activation ticket shows the merchant details, the bank being onboarded,
                    and the QR codes to be placed. The agent generates the QR through the app
                    (no external portal), prints or displays it digitally, captures a photo of it
                    placed at the merchant location, and closes with a merchant OTP — the same
                    verified-by-merchant closure as every other ticket type.
                  </p>

                  {/* Image placeholder — drop QR activation screens here */}
                  <div className="p2-img-placeholder">
                    <div className="p2-img-placeholder-inner">
                      <div className="p2-img-placeholder-label">QR Activation screens</div>
                      <div className="p2-img-placeholder-hint">Add screens to <code>/public/cs2/qr-activation/</code> and replace this block with a PhoneSlideshow component</div>
                    </div>
                  </div>
                </div>

                {/* Design decisions */}
                <div style={{ marginTop: 56, paddingTop: 40, borderTop: "1px solid var(--cs-border)" }}>
                  <div className="cs-subsec-h">Key design decisions</div>
                  <div className="cs-personas" style={{ marginBottom: 32 }}>
                    {[
                      ["Same ticket shell", "QR activation uses the identical ticket card structure as installation and deactivation. Agents instantly knew how to read it — no retraining."],
                      ["In-app QR generation", "Eliminated the external banking portal dependency. Agents never leave the app mid-task."],
                      ["Photo as proof of placement", "Required a photo of the QR code physically placed at the merchant location before the ticket can close. Creates the audit trail that was completely missing before."],
                      ["Merchant OTP closure", "Same verification model as Phase 1 — merchant confirms activation is complete. Eliminates disputes over 'was it done?'"],
                      ["Onboarding card at close", "A brief digital onboarding card — how to accept a QR payment — is shared via WhatsApp at the end. Reduces first-use anxiety."],
                    ].map(([label, text]) => (
                      <div className="cs-persona" key={label as string}>
                        <div className="cs-persona-name">{label}</div>
                        <div className="cs-persona-sub">{text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── 04 · Outcome ── */}
              <div className="cs-sec-v2" id="p2-s04">
                <div className="cs-sec-v2-label">04 &middot; Outcome</div>
                <h2 className="cs-sec-v2-h">
                  One app. All field operations. No exceptions.
                </h2>
                <p className="cs-sec p">
                  With QR activation unified into the Task Force App, field agents now handle their
                  entire day from a single surface. Ops has full visibility into every ticket type
                  including QR activations. The paper-and-WhatsApp process is fully retired.
                </p>

                <div className="cs-stat-hero-row cs-stat-hero-row--outcome">
                  {[
                    ["100%", "New-bank QR activations through the unified app"],
                    ["0", "External portals required for a field agent's workday"],
                    ["Full", "Digital audit trail for QR activation — photo + merchant OTP"],
                    ["Retired", "WhatsApp-based QR activation process"],
                  ].map(([num, label]) => (
                    <div className="cs-stat-hero" key={num}>
                      <div className="cs-stat-hero-num">{num}</div>
                      <div className="cs-stat-hero-label">{label}</div>
                    </div>
                  ))}
                </div>

                <div className="cs-v2-reflect" style={{ marginTop: 48 }}>
                  <div className="cs-v2-reflect-item">
                    <div className="cs-v2-persp-header">
                      <svg className="cs-v2-persp-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/>
                      </svg>
                      <span className="cs-v2-persp-title">What worked</span>
                    </div>
                    <ul className="cs-v2-persp-list">
                      <li>Reusing the exact same ticket shell — zero learning curve for agents</li>
                      <li>Merchant OTP closure created the audit trail ops had never had for QR</li>
                      <li>Shipping as an extension of a trusted surface accelerated adoption</li>
                      <li>Photo-of-placement requirement caught placement errors at the point of activation</li>
                    </ul>
                  </div>
                  <div className="cs-v2-reflect-item">
                    <div className="cs-v2-persp-header">
                      <svg className="cs-v2-persp-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 8v4m0 4h.01M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/>
                      </svg>
                      <span className="cs-v2-persp-title">What&rsquo;s next</span>
                    </div>
                    <ul className="cs-v2-persp-list">
                      <li>QR activation analytics — bank-wise, region-wise completion rates in the manager dashboard</li>
                      <li>Multi-QR batch activation for merchants accepting multiple payment schemes</li>
                      <li>Auto-detection of QR readability via camera at the point of placement</li>
                      <li>WhatsApp onboarding message personalised by bank and merchant category</li>
                    </ul>
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
