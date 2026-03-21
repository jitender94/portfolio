"use client";

import { useState } from "react";

interface Slide {
  src: string;
  annotation: string;
}

interface Props {
  slides: Slide[];
  flowLabel?: string;
}

export default function PhoneSlideshow({ slides, flowLabel }: Props) {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx(i => Math.max(0, i - 1));
  const next = () => setIdx(i => Math.min(slides.length - 1, i + 1));

  return (
    <div className="ps-wrap">
      {flowLabel && <div className="ps-flow-label">{flowLabel}</div>}
      <div className="ps-stage">
        <button className="ps-nav" onClick={prev} disabled={idx === 0} aria-label="Previous">
          &#8592;
        </button>
        <div className="ps-phone">
          <div className="ps-camera" />
          <div className="ps-screen">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={slides[idx].src} alt={slides[idx].annotation} />
          </div>
          <div className="ps-home-bar" />
        </div>
        <button className="ps-nav" onClick={next} disabled={idx === slides.length - 1} aria-label="Next">
          &#8594;
        </button>
      </div>
      <div className="ps-annotation">{slides[idx].annotation}</div>
      <div className="ps-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`ps-dot${i === idx ? " active" : ""}`}
            onClick={() => setIdx(i)}
            aria-label={`Screen ${i + 1}`}
          />
        ))}
      </div>
      <div className="ps-counter">{idx + 1}&thinsp;/&thinsp;{slides.length}</div>
    </div>
  );
}
