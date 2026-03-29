import type { Metadata } from "next";
import { DM_Serif_Display, DM_Mono, Syne, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  weight: ["300", "400", "500"],
  variable: "--font-mono",
  subsets: ["latin"],
});

const syne = Syne({
  weight: ["600", "700", "800"],
  variable: "--font-sans",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  weight: ["400", "500", "600"],
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
      <body
        className={`${dmSerif.variable} ${dmMono.variable} ${syne.variable} ${plusJakarta.variable}`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
