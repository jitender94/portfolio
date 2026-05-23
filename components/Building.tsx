"use client";

import { motion } from "framer-motion";

interface Props {
  onOpenPlugin: () => void;
}

export default function Building({ onOpenPlugin }: Props) {
  const cards = [
    {
      glyph: "Fx",
      type: "Figma Plugin",
      title: "RazorCopy, AI Copy Assistant",
      desc: "A Figma plugin that refines UX copy using AI + Razorpay's tone guidelines — without leaving the canvas.",
      tech: ["Figma Plugin API", "OpenAI", "JavaScript"],
      onClick: onOpenPlugin,
      linkLabel: "View project →",
    },
    {
      glyph: "{ }",
      type: "Frontend Development",
      title: "Project Name, What you built",
      desc: "What this is, what problem it solves, your specific contribution. One key technical challenge you solved and how.",
      tech: ["React", "TypeScript", "Tailwind"],
      onClick: () => {},
      linkLabel: "View project →",
    },
    {
      glyph: "↑",
      type: "This Portfolio",
      title: "Portfolio Website, Built in code",
      desc: "You're looking at it. Next.js, Tailwind, Framer Motion — no templates. Design decisions extend to how things are built.",
      tech: ["Next.js", "Tailwind", "Framer Motion"],
      onClick: () => {},
      linkLabel: "How it was built →",
    },
  ];

  return (
    <motion.section
      id="building"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.04 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <motion.div
        className="section-scroll-wrap"
        initial={{ opacity: 0, y: 40, scale: 0.97, filter: "blur(4px)" }}
        whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="section-label">Building, not just designing</div>
        <div className="section-title">Where design <em>meets code.</em></div>
        <div className="dev-grid">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              className="dev-card"
              onClick={card.onClick}
              style={{ cursor: "pointer" }}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.09, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }}
            >
              <div className="dev-bg-glyph">{card.glyph}</div>
              <div className="dev-type">{card.type}</div>
              <div className="dev-title">{card.title}</div>
              <div className="dev-desc">{card.desc}</div>
              <div className="dev-tech">
                {card.tech.map((t) => (
                  <span key={t} className="tech-tag">{t}</span>
                ))}
              </div>
              <span className="dev-link">{card.linkLabel}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
}
