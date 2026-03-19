"use client";

import { useState } from "react";
import Cursor from "@/components/Cursor";
import Noise from "@/components/Noise";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import Building from "@/components/Building";
import About from "@/components/About";
import Footer from "@/components/Footer";
import CaseStudy1 from "@/components/CaseStudy1";
import CaseStudy1v2 from "@/components/CaseStudy1v2";
import CaseStudy2 from "@/components/CaseStudy2";

export default function Home() {
  const [openCS, setOpenCS] = useState<string | null>(null);

  return (
    <>
      <Cursor />
      <Noise />
      <Nav />
      <main>
        <Hero />
        <Work onOpenCS={setOpenCS} />
        <Building />
        <About />
        <Footer />
      </main>
      <CaseStudy1 isOpen={openCS === "cs1"} onClose={() => setOpenCS(null)} onSwitch={() => setOpenCS("cs1v2")} />
      <CaseStudy1v2 isOpen={openCS === "cs1v2"} onClose={() => setOpenCS(null)} onSwitch={() => setOpenCS("cs1")} />
      <CaseStudy2 isOpen={openCS === "cs2"} onClose={() => setOpenCS(null)} />
    </>
  );
}
