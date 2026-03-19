"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

export default function About() {
  return (
    <section id="about">
      <motion.div
        className="section-label"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        About
      </motion.div>
      <motion.div
        className="section-title"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        A designer who<br /><em>builds things.</em>
      </motion.div>
      <div className="about-grid">
        <motion.div
          className="about-text"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <p>
            I&apos;m a <strong>Senior Product Designer at Razorpay</strong>, where I work on
            payment infrastructure and merchant-facing products.
          </p>
          <p>
            My approach to design is rooted in the belief that{" "}
            <em>understanding the problem is most of the work</em>. I start with research,
            interviews, data, competitive analysis — before touching a single frame.
          </p>
          <p>
            Over the past several years, I&apos;ve worked on products that handle real money at
            scale. What sets my work apart is the ability to{" "}
            <strong>hold the full stack</strong>: from shaping product strategy to shipping
            production-quality UI.
          </p>
          <p>
            I built my first Figma plugin because I was frustrated with a workflow gap no tool
            solved. I don&apos;t wait for someone else to fix the problem.
          </p>
          <p>
            Currently based in <strong>Bengaluru</strong>. Open to senior IC roles and design
            leadership at product-first companies.
          </p>
        </motion.div>
        <motion.div
          className="about-sidebar"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="sidebar-block">
            <div className="sidebar-label">Experience</div>
            <div className="sidebar-row">
              <span className="sidebar-name">Razorpay</span>
              <span className="sidebar-detail">2022 &ndash; Present</span>
            </div>
            <div className="sidebar-row">
              <span className="sidebar-name">Previous Company</span>
              <span className="sidebar-detail">20XX &ndash; 20XX</span>
            </div>
            <div className="sidebar-row">
              <span className="sidebar-name">Previous Company</span>
              <span className="sidebar-detail">20XX &ndash; 20XX</span>
            </div>
          </div>
          <div className="sidebar-block">
            <div className="sidebar-label">Capabilities</div>
            <div className="sidebar-row">
              <span className="sidebar-name">Product Strategy</span>
              <span className="sidebar-detail">Primary</span>
            </div>
            <div className="sidebar-row">
              <span className="sidebar-name">UX Research</span>
              <span className="sidebar-detail">Primary</span>
            </div>
            <div className="sidebar-row">
              <span className="sidebar-name">Interaction Design</span>
              <span className="sidebar-detail">Primary</span>
            </div>
            <div className="sidebar-row">
              <span className="sidebar-name">Frontend Dev</span>
              <span className="sidebar-detail">Strong secondary</span>
            </div>
            <div className="sidebar-row">
              <span className="sidebar-name">Design Systems</span>
              <span className="sidebar-detail">Strong secondary</span>
            </div>
          </div>
          <div className="sidebar-block">
            <div className="sidebar-label">Let&apos;s talk</div>
            <div className="contact-list">
              <a href="mailto:jitenderjeet95@gmail.com" className="contact-row">
                <span className="contact-label">Email</span>
                jitenderjeet95@gmail.com
              </a>
              <a href="https://linkedin.com/in/yourhandle" className="contact-row">
                <span className="contact-label">LinkedIn</span>
                linkedin.com/in/yourhandle
              </a>
              <a href="https://github.com/yourhandle" className="contact-row">
                <span className="contact-label">GitHub</span>
                github.com/yourhandle
              </a>
              <a href="https://twitter.com/yourhandle" className="contact-row">
                <span className="contact-label">Twitter</span>
                @yourhandle
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
