"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface WorkProps {
  onOpenCS: (id: string) => void;
}

const HOOK_TEXT =
  "17,000 support tickets a year because merchants couldn't tell if a payment failure was their code, the bank, or Razorpay. I redesigned the dashboard so they never had to guess again.";

function CaseCard({
  num,
  tags,
  title,
  year,
  delay,
  onClick,
}: {
  num: string;
  tags: { label: string; hi?: boolean }[];
  title: string;
  year: string;
  delay: number;
  onClick: () => void;
}) {
  const hookRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = hookRef.current;
    if (!el) return;
    el.innerHTML = HOOK_TEXT.split(" ")
      .map((w) => `<span class="tok">${w}</span>`)
      .join(" ");
  }, []);

  const handleMouseEnter = () => {
    const toks = hookRef.current?.querySelectorAll<HTMLSpanElement>(".tok");
    if (!toks) return;
    const arr = Array.from(toks).sort(() => Math.random() - 0.5);
    arr.forEach((t, i) =>
      setTimeout(() => t.classList.add("lit"), i * 36)
    );
  };

  const handleMouseLeave = () => {
    hookRef.current
      ?.querySelectorAll<HTMLSpanElement>(".tok")
      .forEach((t) => t.classList.remove("lit"));
  };

  return (
    <motion.div
      className="case-card"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="case-num">{num}</div>
      <div className="case-content">
        <div className="case-tags">
          {tags.map((t) => (
            <span key={t.label} className={`tag${t.hi ? " hi" : ""}`}>
              {t.label}
            </span>
          ))}
        </div>
        <div className="case-title">{title}</div>
        <div className="case-hook" ref={hookRef} />
      </div>
      <div className="case-meta">
        <div className="case-year">{year}</div>
        <span className="case-arrow">&#x2197;</span>
      </div>
    </motion.div>
  );
}

export default function Work({ onOpenCS }: WorkProps) {
  return (
    <section id="work">
      <motion.div
        className="section-label"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
      >
        Selected Work
      </motion.div>
      <motion.div
        className="section-title"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        Two case studies.<br /><em>All of me.</em>
      </motion.div>
      <div className="case-studies">
        <CaseCard
          num="01"
          tags={[
            { label: "Redesign", hi: true },
            { label: "Research" },
            { label: "0→1 Feature" },
            { label: "Razorpay" },
          ]}
          title="Downtime Dashboard 2.0"
          year="2025"
          delay={0.1}
          onClick={() => onOpenCS("cs1")}
        />
        <CaseCard
          num="02"
          tags={[
            { label: "Redesign", hi: true },
            { label: "Iteration" },
            { label: "Data-driven" },
            { label: "Razorpay" },
          ]}
          title="Case Study Title Two"
          year="2023"
          delay={0.22}
          onClick={() => onOpenCS("cs2")}
        />
      </div>
    </section>
  );
}
