"use client";

import { motion } from "framer-motion";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <Nav />

      <main style={{ paddingTop: "100px" }}>
        <section id="about">
          <motion.div
            className="section-scroll-wrap"
            initial={{ opacity: 0, y: 40, scale: 0.97, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
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
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
              >

                <p>
                  Senior Product Designer with <strong>7+ years of experience</strong> building
                  scalable fintech products across <strong>Razorpay</strong> and{" "}
                  <strong>PayU</strong>. I work at the intersection of product thinking, systems
                  design, AI, and execution — designing everything from checkout and payments to POS
                  ecosystems, internal tools, and 0→1 platform experiences.
                </p>
                <p>
                  I enjoy simplifying complex problems, collaborating deeply with cross-functional
                  teams, and building products that create measurable business and user impact. Over
                  the last year, I&apos;ve also been actively exploring{" "}
                  <strong>AI-assisted workflows</strong>, design engineering, and frontend
                  prototyping to push the boundaries of how designers can build and ship faster.
                </p>
                <p>
                  Beyond product work, I&apos;m passionate about design culture, learning, and
                  mentoring — regularly facilitating internal sessions on design craft, AI workflows,
                  and product thinking.
                </p>
                <p>
                  Outside work, you&apos;ll probably find me performing live music somewhere in
                  Bangalore 🎶
                </p>
                <a
                  href="/resume.pdf"
                  download
                  className="about-resume-cta"
                >
                  Download Résumé <span className="about-resume-arrow">→</span>
                </a>
              </motion.div>

              <motion.div
                className="about-sidebar"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25 }}
              >
                <div className="sidebar-block">
                  <div className="sidebar-label">Experience</div>
                  <div className="sidebar-row">
                    <span className="sidebar-name">Razorpay</span>
                    <span className="sidebar-detail">Nov 2023 &ndash; Present</span>
                  </div>
                  <div className="sidebar-row">
                    <span className="sidebar-name">PayU Payments</span>
                    <span className="sidebar-detail">Nov 2020 &ndash; Oct 2023</span>
                  </div>
                  <div className="sidebar-row">
                    <span className="sidebar-name">ADP Pvt Ltd</span>
                    <span className="sidebar-detail">Oct 2017 &ndash; Nov 2019</span>
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
                    <span className="sidebar-name">Musician <span style={{opacity:0.5, fontWeight:400}}>(singer-songwriter)</span></span>
                    <span className="sidebar-detail">Guitar, vocals &amp; originals</span>
                  </div>
                  <div className="sidebar-row">
                    <span className="sidebar-name">Travelling</span>
                    <span className="sidebar-detail">Solo adventures</span>
                  </div>
                  <div className="sidebar-row">
                    <span className="sidebar-name">Sports</span>
                    <span className="sidebar-detail">Running, cricket, basketball</span>
                  </div>
                  <div className="sidebar-row">
                    <span className="sidebar-name">Cooking</span>
                    <span className="sidebar-detail">Amateur chef</span>
                  </div>
                </div>
              </motion.div>
            </div>

          </motion.div>
        </section>

        {/* Photos — separate light section */}
        <section className="about-photos-section">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="about-photos-label">Life outside the screen</div>
            <div className="about-photos-grid">
              {/* Replace src values with actual photo paths */}
              <div className="about-photo-slot">
                <div className="about-photo-placeholder">Photo 1</div>
              </div>
              <div className="about-photo-slot">
                <div className="about-photo-placeholder">Photo 2</div>
              </div>
              <div className="about-photo-slot">
                <div className="about-photo-placeholder">Photo 3</div>
              </div>
              <div className="about-photo-slot">
                <div className="about-photo-placeholder">Photo 4</div>
              </div>
            </div>
          </motion.div>
        </section>
        <Footer />
      </main>
    </>
  );
}
