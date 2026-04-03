import type { Metadata } from "next";
import { DM_Mono, Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const dmMono = DM_Mono({
  weight: ["300", "400", "500"],
  variable: "--font-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  subsets: ["latin"],
});

const monument = localFont({
  src: [
    { path: "../public/fonts/MonumentExtended-Regular.otf",   weight: "400", style: "normal" },
    { path: "../public/fonts/MonumentExtended-Ultrabold.otf", weight: "800", style: "normal" },
  ],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Jitender's Portfolio",
  description:
    "Senior Product Designer at Razorpay, Bengaluru. Research, product thinking, design, and code — the full loop.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${dmMono.variable} ${spaceGrotesk.variable} ${monument.variable}`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
