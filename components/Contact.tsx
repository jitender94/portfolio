"use client";

import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section id="contact">
      <motion.div
        className="section-scroll-wrap"
        initial={{ opacity: 0, y: 40, scale: 0.97, filter: "blur(4px)" }}
        whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="section-label">Let&apos;s Talk</div>
        <div className="contact-strip">
          <a href="mailto:jitenderjeet95@gmail.com" className="contact-strip-row">
            <span className="contact-strip-key">Email</span>
            <span className="contact-strip-val">jitenderjeet95@gmail.com</span>
            <span className="contact-strip-arrow">→</span>
          </a>
          <a
            href="https://linkedin.com/in/jitendersharmaa"
            className="contact-strip-row"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="contact-strip-key">LinkedIn</span>
            <span className="contact-strip-val">linkedin.com/in/jitendersharmaa</span>
            <span className="contact-strip-arrow">→</span>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
