"use client";

import { useEffect, useRef, useState } from "react";

/*
  Lo-fi audio source:
  Add a royalty-free lo-fi MP3 to /public/music/lofi-bg.mp3
  Free options: https://pixabay.com/music/search/lofi/
                https://freemusicarchive.org
*/
const AUDIO_SRC = "/music/lofi-bg.mp3";

export default function MusicPlayer() {
  const [on, setOn] = useState(false);
  const [ready, setReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = 0;
    el.loop = true;
    const onCanPlay = () => setReady(true);
    el.addEventListener("canplay", onCanPlay);
    return () => el.removeEventListener("canplay", onCanPlay);
  }, []);

  const fadeTo = (target: number, onDone?: () => void) => {
    const el = audioRef.current;
    if (!el) return;
    if (fadeRef.current) clearInterval(fadeRef.current);
    const step = target > el.volume ? 0.015 : -0.015;
    fadeRef.current = setInterval(() => {
      if (!el) return;
      const next = el.volume + step;
      if ((step > 0 && next >= target) || (step < 0 && next <= target)) {
        el.volume = Math.max(0, Math.min(1, target));
        clearInterval(fadeRef.current!);
        fadeRef.current = null;
        onDone?.();
      } else {
        el.volume = Math.max(0, Math.min(1, next));
      }
    }, 60);
  };

  const toggle = async () => {
    const el = audioRef.current;
    if (!el) return;
    if (on) {
      setOn(false);
      fadeTo(0, () => el.pause());
    } else {
      setOn(true);
      el.volume = 0;
      try { await el.play(); } catch { /* autoplay blocked */ }
      fadeTo(0.32);
    }
  };

  return (
    <>
      {/* Preload audio silently */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} src={AUDIO_SRC} preload="auto" />

      <div className={`music-fab${on ? " is-on" : ""}`}>
        <button
          className="music-fab-btn"
          onClick={toggle}
          aria-label={on ? "Stop lo-fi music" : "Play lo-fi music"}
          title={on ? "Stop music" : "Play lo-fi music"}
        >
          <span className="music-fab-icon">
            {on ? (
              /* Pause bars */
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="3" y="2" width="4" height="12" rx="1.5"/>
                <rect x="9" y="2" width="4" height="12" rx="1.5"/>
              </svg>
            ) : (
              /* Music note */
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M13 2.5V10a3 3 0 1 1-2-2.83V5.1L6 6v5.5a3 3 0 1 1-2-2.83V4.5a1 1 0 0 1 .76-.97l7-1.75A1 1 0 0 1 13 2.5Z"/>
              </svg>
            )}
          </span>
          <span className="music-fab-label">
            {on ? "Vibing" : "Vibe while browsing"}
          </span>
          {on && (
            <span className="music-fab-eq" aria-hidden="true">
              <span className="mf-bar"/><span className="mf-bar"/><span className="mf-bar"/><span className="mf-bar"/>
            </span>
          )}
        </button>
      </div>
    </>
  );
}
