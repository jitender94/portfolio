"use client";

/**
 * Dev-only visual feedback toolbar (https://agentation.com).
 *
 * Renders a floating toolbar bottom-right of the running app at localhost:3001.
 * Click any element → it captures the CSS selector, DOM path, bounding box and
 * classes, generates structured markdown, and copies to clipboard.
 *
 * Paste that markdown into the Claude Code chat and the agent can act on the
 * exact element instead of guessing from a description.
 *
 * Gated behind NODE_ENV === "development" at the call site in layout.tsx so it
 * never ships to production.
 */
import { Agentation } from "agentation";

export default function AgentationDevToolbar() {
  return <Agentation />;
}
