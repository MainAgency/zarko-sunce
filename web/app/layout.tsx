import type { Metadata, Viewport } from "next";
import { Archivo, Instrument_Serif, Inter_Tight } from "next/font/google";
import "./globals.css";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RevealObserver } from "@/components/RevealObserver";
import { seoRootDefaults } from "@/lib/seo";

const sans = Inter_Tight({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter-tight",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

// Only the logo and the Novosti portal use the heavy brand face.
const display = Archivo({
  subsets: ["latin", "latin-ext"],
  weight: ["800", "900"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  ...seoRootDefaults,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f3f2ee",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="hr"
      suppressHydrationWarning
      className={`${sans.variable} ${serif.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}[data-reveal] .reveal-mask{clip-path:none!important}[data-reveal] .reveal-inner{transform:none!important}`}</style>
        </noscript>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <RevealObserver />
      </body>
    </html>
  );
}
