"use client";

import { useState, useEffect } from "react";
import Cursor from "@/components/Cursor";
import Noise from "@/components/Noise";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import Building from "@/components/Building";
import Writing from "@/components/Writing";
import Footer from "@/components/Footer";
import CaseStudy1 from "@/components/CaseStudy1";
import CaseStudy1v2 from "@/components/CaseStudy1v2";
import CaseStudy2 from "@/components/CaseStudy2";
import CaseStudy2P2 from "@/components/CaseStudy2P2";
import RazorCopy from "@/components/RazorCopy";
import MusicPlayer from "@/components/MusicPlayer";

export default function Home() {
  const [openCS, setOpenCS] = useState<string | null>(null);
  const [openPlugin, setOpenPlugin] = useState(false);

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
        <Building onOpenPlugin={() => setOpenPlugin(true)} />
        <Writing />
        <Footer />
      </main>
      <CaseStudy1 isOpen={openCS === "cs1"} onClose={() => setOpenCS(null)} onSwitch={() => setOpenCS("cs1v2")} />
      <CaseStudy1v2 isOpen={openCS === "cs1v2"} onClose={() => setOpenCS(null)} onSwitch={() => setOpenCS("cs1")} />
      <CaseStudy2 isOpen={openCS === "cs2"} onClose={() => setOpenCS(null)} />
      <CaseStudy2P2 isOpen={openCS === "cs2-p2"} onClose={() => setOpenCS(null)} />
      <RazorCopy isOpen={openPlugin} onClose={() => setOpenPlugin(false)} />
      <MusicPlayer />
    </>
  );
}
