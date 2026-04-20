"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  src: string;
  alt: string;
  label: string;
}

const BASE_H = 680;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4;
const STEP = 0.25;

export default function FlowDiagram({ src, alt, label }: Props) {
  const [zoom, setZoom] = useState(1);
  const [collapsed, setCollapsed] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const clamp = (v: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, parseFloat(v.toFixed(2))));

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        setZoom(z => clamp(z - e.deltaY * 0.008));
      }
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  return (
    <div className="fd-wrap">
      <div className="fd-header">
        <div className="fd-label">{label}</div>
        <button
          className="fd-collapse-btn"
          onClick={() => setCollapsed(v => !v)}
          aria-label={collapsed ? "Expand flow" : "Collapse flow"}
        >
          {collapsed ? "+" : "−"}
        </button>
      </div>

      {!collapsed && (
        <div className="fd-scroll" ref={scrollRef}>
          <div className="fd-zoom-controls">
            <button className="fd-zoom-btn" onClick={() => setZoom(z => clamp(z - STEP))} disabled={zoom <= MIN_ZOOM} aria-label="Zoom out">&#8722;</button>
            <span className="fd-zoom-level">{Math.round(zoom * 100)}%</span>
            <button className="fd-zoom-btn" onClick={() => setZoom(z => clamp(z + STEP))} disabled={zoom >= MAX_ZOOM} aria-label="Zoom in">&#43;</button>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} style={{ height: BASE_H * zoom, width: "auto" }} />
        </div>
      )}

      {!collapsed && (
        <div className="fd-hint">pinch or use +/&#8722; to zoom &nbsp;&middot;&nbsp; scroll to explore</div>
      )}
    </div>
  );
}
