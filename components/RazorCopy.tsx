"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SEC_IDS = ["rc-s01", "rc-s02", "rc-s03", "rc-s04", "rc-s05", "rc-s06"];
const NAV_LABELS = ["Cover", "Problem", "Solution", "Tone modes", "Decisions", "Tech & Learnings"];

export default function RazorCopy({ isOpen, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) { window.history.pushState({ overlay: "rc" }, ""); }
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
      overlay.querySelectorAll(".cs-sec-v2").forEach((el) => observer!.observe(el));
    }, 300);
    return () => { window.clearTimeout(timer); observer?.disconnect(); };
  }, [isOpen]);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const getOffsetTop = (el: HTMLElement, container: HTMLElement): number => {
      let top = 0; let cur: HTMLElement | null = el;
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
    let top = 0; let cur: HTMLElement | null = sec;
    while (cur && cur !== overlay) { top += cur.offsetTop; cur = cur.offsetParent as HTMLElement | null; }
    overlay.scrollTo({ top: top - headerH - progH - 16, behavior: "smooth" });
    sec.classList.add("is-visible");
    sec.querySelectorAll<HTMLElement>(".rc-anim").forEach((el) => el.classList.add("is-visible"));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="overlay"
          id="rc"
          ref={overlayRef}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }}
        >
          {/* Header */}
          <div className="ol-header">
            <button className="ol-back" onClick={onClose}>&larr; Back to portfolio</button>
            <span className="ol-num">Figma Plugin</span>
          </div>

          {/* Progress nav */}
          <div className="cs-progress">
            {NAV_LABELS.map((label, i) => (
              <div key={i} className="cs-prog-step" data-sec={SEC_IDS[i]} onClick={() => scrollTo(SEC_IDS[i])}>
                0{i + 1} {label}
              </div>
            ))}
          </div>

          {/* ── 01 Cover ── */}
          <div id="rc-s01" className="cs-v2-cover cs-sec-v2">
            <div className="rc-cover-hero">
              <div className="rc-cover-badge">AI · Figma Plugin · Razorpay · 2025</div>
              <h1 className="cs-v2-title">RazorCopy</h1>
              <p className="cs-v2-hook">
                Designers at Razorpay were writing UX copy across 40+ screens with no shared tone,
                no consistent voice, and constant context-switching to docs and Notion. I built a
                Figma plugin that refines copy in-place using AI — the entire workflow stays inside
                the canvas.
              </p>
            </div>

            <div className="rc-cover-flow rc-anim">
              {["Select text", "Choose tone mode", "Refine", "Review", "Apply"].map((step, i, arr) => (
                <div key={i} className="rc-flow-item">
                  <div className="rc-flow-step">
                    <span className="rc-flow-num">{i + 1}</span>
                    <span className="rc-flow-label">{step}</span>
                  </div>
                  {i < arr.length - 1 && <span className="rc-flow-arrow">→</span>}
                </div>
              ))}
            </div>

            <div className="cs-v2-overview rc-anim">
              {[
                ["Type", "Figma Plugin"],
                ["Stack", "HTML · CSS · JS · OpenAI API"],
                ["Scope", "Built & shipped at Razorpay"],
                ["Context", "Internal design tooling"],
              ].map(([k, v]) => (
                <div className="cs-v2-overview-item" key={k}>
                  <div className="cs-v2-overview-key">{k}</div>
                  <div className="cs-v2-overview-val">{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="cs-v2-wrap">

            {/* ── 02 Problem ── */}
            <div id="rc-s02" className="cs-sec-v2">
              <div className="cs-sec-v2-label">02 · Problem</div>
              <h2 className="cs-sec-v2-h">Writing UX copy is slow<br />and inconsistent.</h2>
              <p className="cs-sec-v2-intro">
                Designers aren&apos;t UX writers. But they write copy all day — button labels,
                error states, empty states, onboarding prompts. Without a shared voice or fast
                tooling, every screen ends up sounding slightly different.
              </p>

              <div className="cs-v2-persp-grid rc-anim">
                {[
                  { icon: "⏱", title: "SLOW ITERATION", body: "Writing and rewriting across 40+ screens is tedious. One tone change means updating dozens of text nodes manually." },
                  { icon: "🎭", title: "TONE DRIFT", body: "Merchant-facing flows sound friendly. Customer-facing flows sound clinical. No one noticed until it was flagged in a design review." },
                  { icon: "✍️", title: "SKILL GAP", body: "Designers are trained in layout, hierarchy, and interaction — not in copy craft. UX writing requires a different muscle." },
                  { icon: "🔀", title: "CONTEXT SWITCH", body: "The fix was to open a doc, find the tone guide, write something, paste it back. Every iteration broke the design flow." },
                ].map((c, i) => (
                  <div className="cs-v2-persp" key={i}>
                    <div className="cs-v2-persp-header">
                      <span className="cs-v2-persp-icon">{c.icon}</span>
                      <span className="cs-v2-persp-title">{c.title}</span>
                    </div>
                    <ul className="cs-v2-persp-list">
                      <li>{c.body}</li>
                    </ul>
                  </div>
                ))}
              </div>

              {/* Before/after */}
              <div className="rc-before-after rc-anim">
                <div className="rc-ba-col rc-ba-before">
                  <div className="rc-ba-label">Before — inconsistent copy</div>
                  <div className="rc-ba-block">
                    <div className="rc-ba-item rc-ba-bad">"Error occurred. Please try again."</div>
                    <div className="rc-ba-item rc-ba-bad">"Submit form to complete onboarding"</div>
                    <div className="rc-ba-item rc-ba-bad">"This field cannot be left blank."</div>
                  </div>
                </div>
                <div className="rc-ba-col rc-ba-after">
                  <div className="rc-ba-label">After — RazorCopy refined</div>
                  <div className="rc-ba-block">
                    <div className="rc-ba-item rc-ba-good">"Something went wrong. Give it another try."</div>
                    <div className="rc-ba-item rc-ba-good">"You&apos;re almost set up. Finish in one step."</div>
                    <div className="rc-ba-item rc-ba-good">"This field is required to continue."</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── 03 Solution ── */}
            <div id="rc-s03" className="cs-sec-v2">
              <div className="cs-sec-v2-label">03 · Solution</div>
              <h2 className="cs-sec-v2-h">Copy refinement that lives<br />inside Figma.</h2>
              <p className="cs-sec-v2-intro">
                What if you never had to leave the canvas to fix copy? RazorCopy is a Figma plugin
                that reads your selected text, applies Razorpay&apos;s tone guidelines via AI, and
                lets you preview and apply the refined version — without switching a single tab.
              </p>

              {/* Solution callouts */}
              <div className="rc-solution-grid rc-anim">
                {[
                  { label: "No prompt writing", detail: "Designers choose a mode — not a prompt. The AI handles the translation." },
                  { label: "Preview before apply", detail: "Original and refined copy sit side by side. Nothing changes until you confirm." },
                  { label: "Stays in Figma", detail: "No tab-switching, no copy-pasting. The whole flow is a right-click away." },
                  { label: "Razorpay voice baked in", detail: "The AI is pre-primed with Razorpay's brand tone. Designers don't need to know the guidelines." },
                ].map((s, i) => (
                  <div className="rc-sol-card" key={i}>
                    <div className="rc-sol-label">{s.label}</div>
                    <div className="rc-sol-detail">{s.detail}</div>
                  </div>
                ))}
              </div>

              {/* 5-step flow */}
              <div className="cs-subsec-h">How it works</div>
              <div className="rc-steps rc-anim">
                {[
                  { n: "01", title: "Select text or frame", detail: "Click any text node or frame in Figma. RazorCopy reads all text within the selection." },
                  { n: "02", title: "Choose a tone mode", detail: "Pick from three context-aware modes: Razorpay default, Merchant-facing, or Customer-facing." },
                  { n: "03", title: "Refine copy", detail: "Hit Refine. The plugin sends selected text to OpenAI with the appropriate tone prompt." },
                  { n: "04", title: "Review changes", detail: "Original and refined versions appear side by side. Diff-highlighted so you see exactly what changed." },
                  { n: "05", title: "Apply to Figma", detail: "One click applies the refined copy back to the exact text nodes — non-destructively." },
                ].map((s, i) => (
                  <div className="rc-step-row" key={i}>
                    <div className="rc-step-num">{s.n}</div>
                    <div className="rc-step-content">
                      <div className="rc-step-title">{s.title}</div>
                      <div className="rc-step-detail">{s.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── 04 Tone Modes ── */}
            <div id="rc-s04" className="cs-sec-v2">
              <div className="cs-sec-v2-label">04 · Tone modes</div>
              <h2 className="cs-sec-v2-h">Context-aware refinement,<br />not one-size-fits-all.</h2>
              <p className="cs-sec-v2-intro">
                The same copy reads very differently depending on who&apos;s reading it. A merchant
                needs directness. A customer needs warmth. Razorpay&apos;s internal tools need
                balance. Three modes, same input.
              </p>

              <div className="rc-tone-grid rc-anim">
                {[
                  {
                    mode: "Razorpay Default",
                    desc: "Balanced product tone — clear, professional, and on-brand.",
                    badge: "Default",
                    example: "Your payout has been processed. Check your bank account within 2 business days.",
                    color: "#0052CC",
                  },
                  {
                    mode: "Merchant-facing",
                    desc: "Direct and efficient. Merchants need facts, not fluff.",
                    badge: "Merchant",
                    example: "Payout done. Funds in your account in 2 days.",
                    color: "#1a7f37",
                  },
                  {
                    mode: "Customer-facing",
                    desc: "Friendly and simple. Customers need reassurance, not jargon.",
                    badge: "Customer",
                    example: "Great news! Your payment went through. You'll see it in your account soon.",
                    color: "#9333ea",
                  },
                ].map((t, i) => (
                  <div className="rc-tone-card" key={i} style={{ "--rc-tone-color": t.color } as React.CSSProperties}>
                    <div className="rc-tone-badge" style={{ color: t.color, borderColor: t.color + "33", background: t.color + "0f" }}>{t.badge}</div>
                    <div className="rc-tone-mode">{t.mode}</div>
                    <div className="rc-tone-desc">{t.desc}</div>
                    <div className="rc-tone-example">&ldquo;{t.example}&rdquo;</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── 05 Key Decisions ── */}
            <div id="rc-s05" className="cs-sec-v2">
              <div className="cs-sec-v2-label">05 · Key decisions</div>
              <h2 className="cs-sec-v2-h">Designing for trust<br />and usability.</h2>
              <p className="cs-sec-v2-intro">
                Every product decision in this plugin came from watching designers avoid tools that
                interrupted their flow. The goal was zero friction — and zero risk.
              </p>

              <div className="rc-decisions rc-anim">
                {[
                  {
                    n: "01",
                    title: "Non-destructive by default",
                    body: "Copy is never overwritten without explicit confirmation. You always see original and refined side by side before applying. Trust is built through control.",
                  },
                  {
                    n: "02",
                    title: "Modes, not prompts",
                    body: "Designers shouldn't need to know prompt engineering. Abstracting the AI behind three clear modes removes the skill barrier entirely.",
                  },
                  {
                    n: "03",
                    title: "Minimal surface, maximum focus",
                    body: "The plugin panel is small by design. No settings sprawl, no onboarding flows. Open it, do the thing, close it. Cognitive load stays on the design work.",
                  },
                  {
                    n: "04",
                    title: "Works on frames, not just text nodes",
                    body: "Selecting a full frame extracts all child text. This means you can refine an entire screen's copy in a single pass — no node-by-node selection.",
                  },
                ].map((d, i) => (
                  <div className="rc-decision-row" key={i}>
                    <div className="rc-decision-n">{d.n}</div>
                    <div className="rc-decision-body">
                      <div className="rc-decision-title">{d.title}</div>
                      <div className="rc-decision-text">{d.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── 06 Tech & Learnings ── */}
            <div id="rc-s06" className="cs-sec-v2">
              <div className="cs-sec-v2-label">06 · Tech &amp; learnings</div>
              <h2 className="cs-sec-v2-h">From idea to<br />working plugin.</h2>

              {/* Architecture */}
              <div className="cs-subsec-h">How it&apos;s built</div>
              <div className="rc-arch rc-anim">
                {["Figma canvas", "Plugin (HTML/JS)", "OpenAI API", "Refined copy", "Back to Figma"].map((node, i, arr) => (
                  <div key={i} className="rc-arch-item">
                    <div className="rc-arch-node">{node}</div>
                    {i < arr.length - 1 && <div className="rc-arch-arrow">→</div>}
                  </div>
                ))}
              </div>

              <div className="rc-tech-tags rc-anim">
                {["HTML", "CSS", "JavaScript", "Figma Plugin API", "OpenAI API", "Cursor IDE"].map(t => (
                  <span className="rc-tech-tag" key={t}>{t}</span>
                ))}
              </div>

              {/* Impact */}
              <div className="cs-subsec-h">What this unlocks</div>
              <div className="rc-impact-grid rc-anim">
                {[
                  { stat: "Faster", label: "copy iteration across screens" },
                  { stat: "Zero", label: "context-switching during copy review" },
                  { stat: "One click", label: "to apply refined copy to any frame" },
                  { stat: "3 modes", label: "covering all Razorpay product surfaces" },
                ].map((s, i) => (
                  <div className="rc-impact-card" key={i}>
                    <div className="rc-impact-stat">{s.stat}</div>
                    <div className="rc-impact-label">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Learnings */}
              <div className="cs-subsec-h">What I learned</div>
              <div className="rc-learnings rc-anim">
                {[
                  { title: "AI is only as good as its prompt design", body: "The tone modes work because the system prompts were iterated carefully. Writing good prompts is its own design discipline." },
                  { title: "Plugins are high-leverage tools", body: "One plugin, used by every designer on a team, multiplies quality across the entire product. Small tools create outsized workflow impact." },
                  { title: "Understanding code unlocks speed", body: "Building in HTML/JS inside the Figma plugin sandbox meant I could prototype, test, and ship without waiting on anyone." },
                  { title: "Constraints sharpen decisions", body: "The plugin panel is tiny. That forced every UI element to earn its place. No padding to hide in." },
                ].map((l, i) => (
                  <div className="rc-learning-row" key={i}>
                    <div className="rc-learning-title">{l.title}</div>
                    <div className="rc-learning-text">{l.body}</div>
                  </div>
                ))}
              </div>

              {/* Roadmap */}
              <div className="cs-subsec-h">What&apos;s next</div>
              <div className="rc-roadmap rc-anim">
                {[
                  "Checkbox-based node selection — apply copy only to selected items",
                  "Character count controls — set max length per copy block",
                  "Re-scan selections — refresh text after Figma edits",
                  "Individual apply per node — granular control instead of all-or-nothing",
                ].map((item, i) => (
                  <div className="rc-roadmap-item" key={i}>
                    <span className="rc-roadmap-dot" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Closing */}
              <div className="rc-closing rc-anim">
                <div className="rc-closing-line">Designing tools, not just screens.</div>
                <p className="rc-closing-sub">
                  RazorCopy embeds intelligence directly into the design workflow.
                  The best tool is the one you forget you&apos;re using.
                </p>
              </div>
            </div>

          </div>{/* .cs-v2-wrap */}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
