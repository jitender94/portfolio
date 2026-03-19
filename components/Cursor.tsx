"use client";

import { useEffect, useRef } from "react";

function getBgLuminance(x: number, y: number): number {
  let el = document.elementFromPoint(x, y) as HTMLElement | null;
  while (el) {
    const bg = getComputedStyle(el).backgroundColor;
    const match = bg.match(/\d+/g);
    if (match && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
      const [r, g, b] = match.map(Number);
      // Relative luminance (0 = black, 1 = white)
      return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    }
    el = el.parentElement;
  }
  return 0; // dark by default
}

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -200, y: -200 });
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const applyLightBg = () => {
      const { x, y } = posRef.current;
      const lum = getBgLuminance(x, y);
      if (lum > 0.6) {
        dot.classList.add("on-light");
        ring.classList.add("on-light");
      } else {
        dot.classList.remove("on-light");
        ring.classList.remove("on-light");
      }
    };

    const onMove = (e: MouseEvent) => {
      const x = e.clientX + "px";
      const y = e.clientY + "px";
      posRef.current = { x: e.clientX, y: e.clientY };
      dot.style.left = x;
      dot.style.top = y;
      ring.style.left = x;
      ring.style.top = y;
      applyLightBg();
    };

    const onScroll = () => {
      applyLightBg();
      dot.classList.add("scrolling");
      ring.classList.add("scrolling");
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => {
        dot.classList.remove("scrolling");
        ring.classList.remove("scrolling");
      }, 150);
    };

    document.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });

    const hoverEls = document.querySelectorAll("a, button, [role=button], .case-card, .dev-card");
    const addBig = () => ring.classList.add("big");
    const removeBig = () => ring.classList.remove("big");
    hoverEls.forEach((el) => {
      el.addEventListener("mouseenter", addBig);
      el.addEventListener("mouseleave", removeBig);
    });

    return () => {
      document.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      hoverEls.forEach((el) => {
        el.removeEventListener("mouseenter", addBig);
        el.removeEventListener("mouseleave", removeBig);
      });
    };
  }, []);

  return (
    <>
      <div id="cur-dot" ref={dotRef} />
      <div id="cur-ring" ref={ringRef} />
    </>
  );
}
