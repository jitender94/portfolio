"use client";

import { useState } from "react";

interface Props {
  tag: string;
  slides: string[];
}

export default function SurfaceSlideshow({ tag, slides }: Props) {
  const [active, setActive] = useState(0);
  const prev = () => setActive((a) => (a - 1 + slides.length) % slides.length);
  const next = () => setActive((a) => (a + 1) % slides.length);
  return (
    <div className="cs-slideshow">
      <div className="cs-slideshow-bar">
        <div className="cs-mockup-dots">
          <div className="cs-mockup-dot" style={{ background: "#e74c3c" }} />
          <div className="cs-mockup-dot" style={{ background: "#f39c12" }} />
          <div className="cs-mockup-dot" style={{ background: "#2ecc71" }} />
        </div>
        <div className="cs-slideshow-tag">{tag}</div>
        <div className="cs-slide-counter">{active + 1}&thinsp;/&thinsp;{slides.length}</div>
      </div>
      <div className="cs-slideshow-viewport">
        <div className="cs-slide-placeholder">
          <span>{slides[active]}</span>
        </div>
        {slides.length > 1 && (
          <>
            <button className="cs-slide-arrow cs-slide-prev" onClick={prev} aria-label="Previous">&#8592;</button>
            <button className="cs-slide-arrow cs-slide-next" onClick={next} aria-label="Next">&#8594;</button>
          </>
        )}
      </div>
      {slides.length > 1 && (
        <div className="cs-slide-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`cs-slide-dot${i === active ? " active" : ""}`}
              onClick={() => setActive(i)}
              aria-label={`Go to screen ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
