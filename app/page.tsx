"use client";

import { useState, useEffect } from "react";
import Cursor from "@/components/Cursor";
import Noise from "@/components/Noise";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import Building from "@/components/Building";
import Writing from "@/components/Writing";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CaseStudy1 from "@/components/CaseStudy1";
import CaseStudy1v2 from "@/components/CaseStudy1v2";
import CaseStudy2 from "@/components/CaseStudy2";
import CaseStudy2v2 from "@/components/CaseStudy2v2";
import CaseStudy2P2 from "@/components/CaseStudy2P2";
import CaseStudy3 from "@/components/CaseStudy3";
import RazorCopy from "@/components/RazorCopy";
import BladeCS from "@/components/BladeCS";
import MusicPlayer from "@/components/MusicPlayer";

export default function Home() {
  const [openCS, setOpenCS] = useState<string | null>(null);
  const [openPlugin, setOpenPlugin] = useState(false);
  const [openBlade, setOpenBlade] = useState(false);
  const [openPortfolio, setOpenPortfolio] = useState(false);

  useEffect(() => {
    const target = sessionStorage.getItem("scrollTo");
    if (!target) return;
    sessionStorage.removeItem("scrollTo");
    const el = document.getElementById(target);
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 80);
    }
  }, []);

  return (
    <>
      <Cursor />
      <Noise />
      <Nav />
      <main>
        <Hero />
        <Work onOpenCS={setOpenCS} />
        <Building onOpenPlugin={() => setOpenPlugin(true)} onOpenBlade={() => setOpenBlade(true)} onOpenPortfolio={() => setOpenPortfolio(true)} />
        <Writing />
        <Contact />
        <Footer />
      </main>
      <CaseStudy1 isOpen={openCS === "cs1"} onClose={() => setOpenCS(null)} onSwitch={() => setOpenCS("cs1v2")} />
      <CaseStudy1v2 isOpen={openCS === "cs1v2"} onClose={() => setOpenCS(null)} onSwitch={() => setOpenCS("cs1")} />
      <CaseStudy2 isOpen={openCS === "cs2"} onClose={() => setOpenCS(null)} onSwitch={() => setOpenCS("cs2v2")} />
      <CaseStudy2v2 isOpen={openCS === "cs2v2"} onClose={() => setOpenCS(null)} onSwitch={() => setOpenCS("cs2")} />
      <CaseStudy2P2 isOpen={openCS === "cs2-p2"} onClose={() => setOpenCS(null)} />
      <CaseStudy3 isOpen={openPortfolio} onClose={() => setOpenPortfolio(false)} />
      <RazorCopy isOpen={openPlugin} onClose={() => setOpenPlugin(false)} />
      <BladeCS isOpen={openBlade} onClose={() => setOpenBlade(false)} />
      <MusicPlayer />
    </>
  );
}
