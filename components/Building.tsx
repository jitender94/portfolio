"use client";

import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay } },
});

export default function Building() {
  const cards = [
    {
      glyph: "Fx",
      type: "Figma Plugin",
      title: "Plugin Name, What it does",
      desc: "The problem this solved in your design workflow. Who uses it, how many installs, what pain it removed.",
      tech: ["TypeScript", "Figma API", "React"],
      link: "#",
      linkLabel: "View plugin →",
    },
    {
      glyph: "{ }",
      type: "Frontend Development",
      title: "Project Name, What you built",
      desc: "What this is, what problem it solves, your specific contribution. One key technical challenge you solved and how.",
      tech: ["React", "TypeScript", "Tailwind"],
      link: "#",
      linkLabel: "View project →",
    },
    {
      glyph: "∞",
      type: "Design System",
      title: "System Name, Scope & scale",
      desc: "The design system or component library you contributed to. Components built, adoption numbers, teams that used it.",
      tech: ["Figma", "Storybook", "CSS"],
      link: "#",
      linkLabel: "View system →",
    },
    {
      glyph: "↑",
      type: "This Portfolio",
      title: "Portfolio Website, Built in code",
      desc: "You're looking at it. Next.js, Tailwind, Framer Motion — no templates. Design decisions extend to how things are built.",
      tech: ["Next.js", "Tailwind", "Framer Motion"],
      link: "https://github.com/yourhandle",
      linkLabel: "View source →",
    },
  ];

  return (
    <section id="building">
      <motion.div
        className="section-label"
        variants={fadeUp()}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        Building, not just designing
      </motion.div>
      <motion.div
        className="section-title"
        variants={fadeUp(0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        Where design<br /><em>meets code.</em>
      </motion.div>
      <div className="dev-grid">
        {cards.map((card, i) => (
          <motion.a
            key={i}
            href={card.link}
            className="dev-card"
            variants={fadeUp(i * 0.08)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
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
          </motion.a>
        ))}
      </div>
    </section>
  );
}
