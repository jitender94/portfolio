"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [light, setLight] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 60);
      setLight(y > window.innerHeight * 0.85);

      if (pathname !== "/") return;

      const building = document.getElementById("building");
      const work = document.getElementById("work");
      const buildingTop = building ? building.getBoundingClientRect().top : Infinity;
      const workTop = work ? work.getBoundingClientRect().top : Infinity;

      if (buildingTop <= 120) setActiveSection("building");
      else if (workTop <= 120) setActiveSection("work");
      else setActiveSection("");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      sessionStorage.setItem("scrollTo", id);
      router.push("/");
    }
  };

  const isAbout = pathname === "/about";
  const isWork = !isAbout && activeSection === "work";
  const isBuilding = !isAbout && activeSection === "building";
  const isLight = isAbout || light;

  return (
    <nav id="nav" className={`${scrolled || isAbout ? "scrolled" : ""} ${isLight ? "light" : ""}`}>
      <Link className="nav-logo" href="/">jeet.design</Link>
      <ul className="nav-links">
        <li><a href="/#work" onClick={scrollTo("work")} className={isWork ? "nav-active" : ""}>Work</a></li>
        <li><a href="/#building" onClick={scrollTo("building")} className={isBuilding ? "nav-active" : ""}>Building</a></li>
        <li><Link href="/about" className={isAbout ? "nav-active" : ""}>About</Link></li>
      </ul>
      <a className="nav-cta" href="mailto:jitenderjeet95@gmail.com">
        Get in touch &rarr;
      </a>
    </nav>
  );
}
