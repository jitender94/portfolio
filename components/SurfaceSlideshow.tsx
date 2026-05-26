"use client";

import { useState } from "react";

interface Props {
  tag: string;
  slides: string[];
  /** When true, render image(s) without the desktop-browser chrome (traffic
   *  dots + counter bar). Used for illustrations and diagrams that aren't web
   *  mockups. The `tag` is shown as a caption below the image instead. */
  bare?: boolean;
}

export default function SurfaceSlideshow({ tag, slides, bare = false }: Props) {
  const [active, setActive] = useState(0);
  const prev = () => setActive((a) => (a - 1 + slides.length) % slides.length);
  const next = () => setActive((a) => (a + 1) % slides.length);

  /* ── Bare mode — no browser chrome, just image + caption below ── */
  if (bare) {
    return (
      <figure
        style={{
          margin: "0 0 8px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ position: "relative", width: "100%" }}>
          {slides[active].startsWith("/") ? (
            <img
              key={slides[active]}
              src={slides[active]}
              alt={tag}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
            />
          ) : (
            <div className="cs-slide-placeholder">
              <span>{slides[active]}</span>
            </div>
          )}
          {slides.length > 1 && (
            <>
              <button className="cs-slide-arrow cs-slide-prev" onClick={prev} aria-label="Previous">&#8592;</button>
              <button className="cs-slide-arrow cs-slide-next" onClick={next} aria-label="Next">&#8594;</button>
            </>
          )}
        </div>
        <figcaption
          style={{
            marginTop: 12,
            fontSize: 13,
            lineHeight: 1.5,
            color: "var(--cs-dim)",
            textAlign: "center",
            fontFamily: "var(--mono)",
            letterSpacing: "0.04em",
          }}
        >
          {tag}
        </figcaption>
        {slides.length > 1 && (
          <div className="cs-slide-dots" style={{ marginTop: 8 }}>
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
      </figure>
    );
  }

  /* ── Default — full browser-chrome treatment (for actual web mockups) ── */
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
        {slides[active].startsWith("/") ? (
          <img
            key={slides[active]}
            src={slides[active]}
            alt={`Screen ${active + 1}`}
            className="cs-slide-img"
          />
        ) : (
          <div className="cs-slide-placeholder">
            <span>{slides[active]}</span>
          </div>
        )}
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
