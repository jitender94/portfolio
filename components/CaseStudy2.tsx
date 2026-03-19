"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CaseStudy2({ isOpen, onClose }: Props) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="overlay"
          id="cs2"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="ol-header">
            <button className="ol-back" onClick={onClose}>
              &larr; Back to portfolio
            </button>
            <span className="ol-num">Case Study 02</span>
          </div>
          <div className="ol-body">
            <div className="cs-tag">Razorpay &middot; 2023 &middot; Product Design</div>
            <div className="cs-title">The Full<br /><em>Case Study Title</em></div>
            <p className="cs-hook">
              Your one-sentence problem statement for case study 2. Make the stakes clear immediately.
            </p>
            <div className="cs-meta">
              <div className="cs-meta-cell"><div className="cs-meta-label">My Role</div><div className="cs-meta-val">Lead Product Designer</div></div>
              <div className="cs-meta-cell"><div className="cs-meta-label">Timeline</div><div className="cs-meta-val">3 months</div></div>
              <div className="cs-meta-cell"><div className="cs-meta-label">Team</div><div className="cs-meta-val">1 PM, 4 Eng, Me</div></div>
              <div className="cs-meta-cell"><div className="cs-meta-label">Platform</div><div className="cs-meta-val">Mobile + Web</div></div>
            </div>
            <div className="cs-sec">
              <div className="cs-sec-label">01 &middot; Problem Space</div>
              <h3>What was broken and why it mattered</h3>
              <p>Begin with context. Replace this with your actual case study content following the same structure as Case Study 1.</p>
              <div className="cs-stats">
                <div className="cs-stat"><div className="cs-stat-num">XX%</div><div className="cs-stat-label">Key metric that defined the problem</div></div>
                <div className="cs-stat"><div className="cs-stat-num">XX+</div><div className="cs-stat-label">Scale or users involved</div></div>
              </div>
            </div>
            <div className="cs-sec">
              <div className="cs-sec-label">02 — 04 &middot; Research &middot; Exploration &middot; Solution</div>
              <h3>[ Fill in your case study content ]</h3>
              <p>Continue with the same structure: Research → Exploration → Solution → Outcome &amp; Reflection.</p>
              <div className="cs-img"><span>Your design work here</span></div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
