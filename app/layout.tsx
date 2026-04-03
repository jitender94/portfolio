import type { Metadata } from "next";
import { DM_Mono, Space_Grotesk } from "next/font/google";
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
      <head>
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=monument-extended@800,400&display=swap" />
      </head>
      <body
        className={`${dmMono.variable} ${spaceGrotesk.variable}`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
