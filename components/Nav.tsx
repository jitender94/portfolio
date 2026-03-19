"use client";

import { useEffect, useState } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [light, setLight] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 60);
      setLight(y > window.innerHeight * 0.85);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav id="nav" className={`${scrolled ? "scrolled" : ""} ${light ? "light" : ""}`}>
      <a className="nav-logo" href="#home">JS &mdash; Portfolio</a>
      <ul className="nav-links">
        <li><a href="#work">Work</a></li>
        <li><a href="#building">Building</a></li>
        <li><a href="#about">About</a></li>
      </ul>
      <a className="nav-cta" href="mailto:jitenderjeet95@gmail.com">
        Get in touch &rarr;
      </a>
    </nav>
  );
}
