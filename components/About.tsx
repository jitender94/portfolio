"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about">
      <motion.div
        className="section-scroll-wrap"
        initial={{ opacity: 0, y: 40, scale: 0.97, filter: "blur(4px)" }}
        whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
      <div className="section-label">About</div>
      <div className="section-title">
        A designer who<br /><em>builds things.</em>
      </div>
      <div className="about-grid">
        <motion.div
          className="about-text"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.15 }}
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
            Outside work, I&apos;m a musician — I play guitar, write songs, sing, and compose.
            Music and design share more than I expected. Both are about arranging elements until
            something resonates.
          </p>
          <p>
            Currently based in <strong>Bengaluru</strong>. Open to senior IC roles and design
            leadership at product-first companies.
          </p>
        </motion.div>
        <motion.div
          className="about-sidebar"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.25 }}
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
            <div className="sidebar-label music-label">
              <span className="eq-bars" aria-hidden="true">
                <span className="eq-bar" />
                <span className="eq-bar" />
                <span className="eq-bar" />
                <span className="eq-bar" />
                <span className="eq-bar" />
              </span>
              When not designing
            </div>
            <div className="sidebar-row">
              <span className="sidebar-name">Guitar</span>
              <span className="sidebar-detail">Lead instrument</span>
            </div>
            <div className="sidebar-row">
              <span className="sidebar-name">Vocalist</span>
              <span className="sidebar-detail">Lead &amp; harmonies</span>
            </div>
            <div className="sidebar-row">
              <span className="sidebar-name">Songwriter</span>
              <span className="sidebar-detail">Original compositions</span>
            </div>
            <div className="sidebar-row">
              <span className="sidebar-name">Music composition</span>
              <span className="sidebar-detail">Film &amp; ambient</span>
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
      </motion.div>
    </section>
  );
}
