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
            Senior Product Designer with <strong>7+ years of experience</strong> defining and
            shipping scalable fintech products at <strong>Razorpay</strong> and{" "}
            <strong>PayU</strong>. Experienced in leading design across complex, cross-functional
            teams — from setting product direction and shaping roadmaps to raising the design bar
            through mentorship and process.
          </p>
          <p>
            An early AI adopter who actively integrates AI into the design workflow, constantly
            exploring new tools and techniques to build more delightful, user-centric products
            faster and with greater impact. Pioneered <strong>AI-assisted design workflows</strong>{" "}
            at Razorpay — one of the first designers to raise a PR for frontend Dashboard work
            using internal/external MCPs, and a Top-10 finalist at the Razorpay AI Hackathon.
          </p>
          <p>
            Beyond product work, I drive design culture through learning and mentorship —
            facilitating <strong>15+ sessions</strong> on design craft, AI workflows, and product
            thinking across the team.
          </p>
          <p>
            Outside work, you&apos;ll probably find me performing live music somewhere in
            Bangalore 🎶
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
              <span className="sidebar-detail">Nov 2023 &ndash; Present</span>
            </div>
            <div className="sidebar-row">
              <span className="sidebar-name">PayU Payments</span>
              <span className="sidebar-detail">Nov 2020 &ndash; Oct 2023</span>
            </div>
            <div className="sidebar-row">
              <span className="sidebar-name">Freelance UX Designer</span>
              <span className="sidebar-detail">Feb 2020 &ndash; Nov 2020</span>
            </div>
            <div className="sidebar-row">
              <span className="sidebar-name">ADP Pvt Ltd</span>
              <span className="sidebar-detail">Oct 2017 &ndash; Nov 2019</span>
            </div>
          </div>
          <div className="sidebar-block">
            <div className="sidebar-label">Skills</div>
            <div className="sidebar-row">
              <span className="sidebar-name">Design</span>
              <span className="sidebar-detail">UX, Interaction, Systems, Prototyping</span>
            </div>
            <div className="sidebar-row">
              <span className="sidebar-name">AI &amp; Engineering</span>
              <span className="sidebar-detail">Claude Code, Figma Make, React, HTML/CSS</span>
            </div>
            <div className="sidebar-row">
              <span className="sidebar-name">Product Thinking</span>
              <span className="sidebar-detail">0→1, B2B SaaS, Data-driven Design</span>
            </div>
            <div className="sidebar-row">
              <span className="sidebar-name">Tools</span>
              <span className="sidebar-detail">Figma, Marvin, Hotjar, Notion, Jira</span>
            </div>
          </div>
          <div className="sidebar-block">
            <div className="sidebar-label">Education</div>
            <div className="sidebar-row">
              <span className="sidebar-name">BE Computer Engineering</span>
              <span className="sidebar-detail">2013 &ndash; 2017</span>
            </div>
            <div className="sidebar-row">
              <span className="sidebar-name" style={{ opacity: 0.6, fontWeight: 400, fontSize: 13 }}>University of Pune &middot; First Class with Distinction</span>
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
  );
}
