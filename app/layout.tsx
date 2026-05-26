import type { Metadata } from "next";
import "./globals.css";
import AgentationDevToolbar from "./AgentationDevToolbar";

export const metadata: Metadata = {
  title: "Jitender's Portfolio",
  description:
    "Senior Product Designer at Razorpay, Bengaluru. Research, product thinking, design, and code - the full loop.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {children}
        {/* Dev-only: visual-feedback toolbar (click any element → copy
            structured markdown → paste into chat). NODE_ENV check is
            statically replaced by Next.js — stripped from production builds. */}
        {process.env.NODE_ENV === "development" && <AgentationDevToolbar />}
      </body>
    </html>
  );
}
