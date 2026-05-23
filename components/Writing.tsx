"use client";

import { motion } from "framer-motion";

const articles = [
  {
    title: "Figma or Claude Code? You're Asking the Wrong Question",
    publication: "Personal",
    date: "Apr 2026",
    readTime: "8 min read",
    url: "https://medium.com/@uxjeet/figma-or-claude-code-youre-asking-the-wrong-question-872e4daa198b",
  },
  {
    title: "From Clicks to Context: The Power of Contextual Payments",
    publication: "Design @PayU",
    date: "Sep 2023",
    readTime: "4 min read",
    url: "https://medium.com/design-payu/from-clicks-to-context-the-power-of-contextual-payments-819be1045ba7",
  },
];

export default function Writing() {
  return (
    <motion.section
      id="writing"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.04 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <motion.div
        className="section-scroll-wrap"
        initial={{ opacity: 0, y: 32, filter: "blur(4px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="section-label">Writing</div>
        <div className="writing-header-row">
          <div className="section-title" style={{ marginBottom: 0 }}>
            Thinking out <em>loud.</em>
          </div>
          <a
            href="https://medium.com/@uxjeet"
            target="_blank"
            rel="noopener noreferrer"
            className="writing-all-link"
          >
            All articles →
          </a>
        </div>

        <div className="writing-list">
          {articles.map((a, i) => (
            <motion.a
              key={i}
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="writing-row"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="writing-row-meta">
                <span className="writing-pub">{a.publication}</span>
                <span className="writing-dot" />
                <span className="writing-date">{a.date}</span>
                <span className="writing-dot" />
                <span className="writing-time">{a.readTime}</span>
              </div>
              <div className="writing-row-title">{a.title}</div>
              <span className="writing-arrow">→</span>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
}
